from datetime import datetime, timezone
from pathlib import Path
import logging
import re
import uuid
from typing import Dict, List, Optional

from sqlalchemy import desc, func, select
from sqlalchemy.exc import IntegrityError

from app.ai.extractor import ExtractedDocument, OpenAIExtractor
from app.models import Document, ProcessedMessage, Reminder, WhatsAppUser
from app.services.reminders import ReminderService
from app.whatsapp.client import WhatsAppClient
from app.whatsapp.webhook_parser import InboundWhatsAppEvent, WhatsAppWebhookParser

logger = logging.getLogger(__name__)


class BotProcessor:
    def __init__(
        self,
        settings,
        session_factory,
        whatsapp_client: WhatsAppClient,
        extractor: OpenAIExtractor,
        reminder_service: ReminderService,
    ):
        self.settings = settings
        self.session_factory = session_factory
        self.whatsapp_client = whatsapp_client
        self.extractor = extractor
        self.reminder_service = reminder_service
        self.parser = WhatsAppWebhookParser()
        self.uploads_dir = settings.uploads_path
        self.uploads_dir.mkdir(parents=True, exist_ok=True)

    def process_webhook_payload(self, payload: Dict[str, object]) -> List[str]:
        outcomes = []
        for event in self.parser.parse(payload):
            outcomes.append(self.process_event(event))
        return outcomes or ["ignored"]

    def process_event(self, event: InboundWhatsAppEvent) -> str:
        user = self._upsert_user(event)
        if not self._reserve_message(event, user):
            return "duplicate_ignored"

        try:
            if event.event_type == "button":
                outcome = self._handle_button_event(event)
            elif event.event_type == "text":
                outcome = self._handle_text_event(event, user)
            elif event.event_type in ("image", "document"):
                outcome = self._handle_media_event(event, user)
            else:
                outcome = "ignored"

            self._finalize_processed_message(event.message_id, "processed", outcome)
            return outcome
        except Exception:
            logger.exception("Message processing failed for whatsapp_message_id=%s", event.message_id)
            self._finalize_processed_message(event.message_id, "error", "processing_error")
            try:
                self.whatsapp_client.send_text_message(
                    to=event.from_number,
                    body="C'e stato un problema temporaneo durante l'elaborazione del messaggio.",
                )
            except Exception:
                logger.warning("Unable to send failure message for whatsapp_message_id=%s", event.message_id)
            return "processing_error"

    def get_documents(self, limit: int = 50) -> List[Dict[str, object]]:
        with self.session_factory() as session:
            documents = list(session.execute(select(Document).order_by(desc(Document.created_at)).limit(limit)).scalars())
            return [
                {
                    "id": document.id,
                    "user_id": document.user_id,
                    "source_kind": document.source_kind,
                    "tipo_documento": document.tipo_documento,
                    "fornitore": document.fornitore,
                    "importo": float(document.importo) if document.importo is not None else None,
                    "valuta": document.valuta,
                    "data_documento": document.data_documento.isoformat() if document.data_documento else None,
                    "data_scadenza": document.data_scadenza.isoformat() if document.data_scadenza else None,
                    "categoria": document.categoria,
                    "azione_consigliata": document.azione_consigliata,
                    "riepilogo": document.riepilogo,
                    "confidenza": document.confidenza,
                    "reminder_status": document.reminder_status,
                    "created_at": document.created_at.isoformat(),
                }
                for document in documents
            ]

    def _handle_text_event(self, event: InboundWhatsAppEvent, user: WhatsAppUser) -> str:
        text = (event.text or "").strip()
        lowered = text.lower()
        if not text:
            return "empty_text"

        if lowered in ("ciao", "aiuto", "/start", "start", "help"):
            self.whatsapp_client.send_text_message(to=event.from_number, body=self._welcome_message())
            return "welcome_sent"

        if lowered == "ultimi":
            self.whatsapp_client.send_text_message(to=event.from_number, body=self._build_recent_documents_message(user.id))
            return "recent_documents_sent"

        if lowered == "stato":
            self.whatsapp_client.send_text_message(to=event.from_number, body=self._build_status_message(user.id))
            return "status_sent"

        if text.upper().startswith("PROMEMORIA "):
            document_id = text.split(" ", 1)[1].strip()
            return self._create_reminder_and_reply(event.from_number, document_id)

        if text.upper().startswith("SALTA "):
            document_id = text.split(" ", 1)[1].strip()
            return self._skip_reminder_and_reply(event.from_number, document_id)

        extraction = self.extractor.extract_from_text(text)
        document = self._create_document_record(
            user_id=user.id,
            event=event,
            source_kind="text",
            file_name="text-message.txt",
            mime_type="text/plain",
            media_id=None,
            text_content=text,
            extraction=extraction,
        )
        reply = self._build_document_reply(document, auto_create_reminder=True)
        self.whatsapp_client.send_text_message(to=event.from_number, body=reply)
        return "text_processed"

    def _handle_button_event(self, event: InboundWhatsAppEvent) -> str:
        button_id = event.button_id or ""
        if button_id.startswith("reminder:create:"):
            return self._create_reminder_and_reply(event.from_number, button_id.split(":", 2)[2])
        if button_id.startswith("reminder:skip:"):
            return self._skip_reminder_and_reply(event.from_number, button_id.split(":", 2)[2])
        self.whatsapp_client.send_text_message(to=event.from_number, body="Azione non riconosciuta.")
        return "unknown_button"

    def _handle_media_event(self, event: InboundWhatsAppEvent, user: WhatsAppUser) -> str:
        if not event.media_id:
            self.whatsapp_client.send_text_message(to=event.from_number, body="Media non valido o non supportato.")
            return "invalid_media"

        self.whatsapp_client.send_text_message(to=event.from_number, body="Sto analizzando il documento...")
        media = self.whatsapp_client.download_media(media_id=event.media_id, fallback_file_name=event.file_name or "document")
        upload_path = self._write_upload(media.file_name, media.content)
        try:
            extraction = self.extractor.extract_from_file(
                file_name=upload_path.name,
                mime_type=media.mime_type,
                content=media.content,
                caption=event.text,
            )
        finally:
            upload_path.unlink(missing_ok=True)

        document = self._create_document_record(
            user_id=user.id,
            event=event,
            source_kind=event.event_type,
            file_name=media.file_name,
            mime_type=media.mime_type,
            media_id=event.media_id,
            text_content=event.text,
            extraction=extraction,
        )
        reply = self._build_document_reply(document, auto_create_reminder=True)
        self.whatsapp_client.send_text_message(to=event.from_number, body=reply)
        return "media_processed"

    def _create_document_record(
        self,
        user_id: str,
        event: InboundWhatsAppEvent,
        source_kind: str,
        file_name: str,
        mime_type: str,
        media_id: Optional[str],
        text_content: Optional[str],
        extraction: ExtractedDocument,
    ) -> Document:
        with self.session_factory() as session:
            document = Document(
                user_id=user_id,
                whatsapp_message_id=event.message_id,
                media_id=media_id,
                source_kind=source_kind,
                file_name=file_name,
                mime_type=mime_type,
                text_content=text_content,
                tipo_documento=extraction.tipo_documento,
                fornitore=extraction.fornitore,
                importo=extraction.importo,
                valuta=extraction.valuta,
                data_documento=extraction.data_documento,
                data_scadenza=extraction.data_scadenza,
                categoria=extraction.categoria,
                azione_consigliata=extraction.azione_consigliata,
                riepilogo=extraction.riepilogo,
                confidenza=extraction.confidenza,
                raw_extraction=extraction.model_dump(mode="json"),
                raw_json=event.raw_message,
                reminder_status="eligible" if extraction.data_scadenza else "missing_due_date",
            )
            session.add(document)
            session.commit()
            session.refresh(document)
            return document

    def _build_document_reply(self, document: Document, auto_create_reminder: bool) -> str:
        lines = [
            "CustodeAI ha salvato il documento.",
            "Tipo: {0}".format(document.tipo_documento),
            "Fornitore: {0}".format(document.fornitore or "non trovato"),
            "Importo: {0}".format(self._format_amount(document.importo, document.valuta)),
            "Data documento: {0}".format(document.data_documento.isoformat() if document.data_documento else "non trovata"),
            "Data scadenza: {0}".format(document.data_scadenza.isoformat() if document.data_scadenza else "non trovata"),
            "Categoria: {0}".format(document.categoria or "non trovata"),
            "Azione consigliata: {0}".format(document.azione_consigliata or "nessuna"),
        ]
        if document.riepilogo:
            lines.append("Riepilogo: {0}".format(document.riepilogo))

        if auto_create_reminder and document.data_scadenza:
            result = self.reminder_service.create_reminder_for_document(document.id)
            lines.append(result.message)
        elif document.data_scadenza is None:
            lines.append("Nessun promemoria creato: non ho trovato una data di scadenza.")

        return "\n".join(lines)

    def _create_reminder_and_reply(self, phone_number: str, document_id: str) -> str:
        try:
            result = self.reminder_service.create_reminder_for_document(document_id)
            self.whatsapp_client.send_text_message(to=phone_number, body=result.message)
            return result.status
        except ValueError as exc:
            self.whatsapp_client.send_text_message(to=phone_number, body=str(exc))
            return "reminder_error"

    def _skip_reminder_and_reply(self, phone_number: str, document_id: str) -> str:
        try:
            result = self.reminder_service.skip_reminder_for_document(document_id)
            self.whatsapp_client.send_text_message(to=phone_number, body=result.message)
            return result.status
        except ValueError as exc:
            self.whatsapp_client.send_text_message(to=phone_number, body=str(exc))
            return "reminder_error"

    def _upsert_user(self, event: InboundWhatsAppEvent) -> WhatsAppUser:
        with self.session_factory() as session:
            user = session.execute(select(WhatsAppUser).where(WhatsAppUser.wa_id == event.from_number)).scalars().first()
            if user is None:
                user = WhatsAppUser(
                    wa_id=event.from_number,
                    profile_name=event.profile_name,
                    last_message_at=event.timestamp,
                )
            else:
                user.profile_name = event.profile_name or user.profile_name
                user.last_message_at = event.timestamp
            session.add(user)
            session.commit()
            session.refresh(user)
            return user

    def _reserve_message(self, event: InboundWhatsAppEvent, user: WhatsAppUser) -> bool:
        with self.session_factory() as session:
            try:
                processed = ProcessedMessage(
                    user_id=user.id,
                    whatsapp_message_id=event.message_id,
                    message_type=event.message_type,
                    status="processing",
                    raw_json=event.raw_message,
                )
                session.add(processed)
                session.commit()
                return True
            except IntegrityError:
                session.rollback()
                return False

    def _finalize_processed_message(self, message_id: str, status: str, outcome: str):
        with self.session_factory() as session:
            processed = session.execute(
                select(ProcessedMessage).where(ProcessedMessage.whatsapp_message_id == message_id)
            ).scalars().first()
            if processed is None:
                return
            processed.status = status
            processed.outcome = outcome
            session.add(processed)
            session.commit()

    def _welcome_message(self) -> str:
        return (
            "Ciao, sono CustodeAI. Mandami una bolletta, uno scontrino, un PDF o un messaggio con una scadenza. "
            "Io salvo il documento e ti ricordo cosa fare."
        )

    def _build_recent_documents_message(self, user_id: str) -> str:
        with self.session_factory() as session:
            documents = list(
                session.execute(
                    select(Document)
                    .where(Document.user_id == user_id)
                    .order_by(desc(Document.created_at))
                    .limit(5)
                ).scalars()
            )
        if not documents:
            return "Non ho ancora documenti salvati per questo numero."

        lines = ["Ultimi documenti salvati:"]
        for document in documents:
            due_text = document.data_scadenza.isoformat() if document.data_scadenza else "nessuna scadenza"
            lines.append(
                "- {0}: {1} | {2}".format(
                    document.tipo_documento,
                    document.fornitore or "fornitore non trovato",
                    due_text,
                )
            )
        return "\n".join(lines)

    def _build_status_message(self, user_id: str) -> str:
        with self.session_factory() as session:
            documents_count = session.execute(
                select(func.count()).select_from(Document).where(Document.user_id == user_id)
            ).scalar_one()
            reminders_count = session.execute(
                select(func.count()).select_from(Reminder).where(Reminder.user_id == user_id, Reminder.status == "pending")
            ).scalar_one()
        return "Stato account:\nDocumenti salvati: {0}\nPromemoria in attesa: {1}".format(
            documents_count,
            reminders_count,
        )

    def _write_upload(self, file_name: str, content: bytes) -> Path:
        safe_name = re.sub(r"[^A-Za-z0-9._-]", "-", file_name or "document")
        target = self.uploads_dir / "{0}-{1}".format(uuid.uuid4().hex, safe_name[:120] or "document")
        target.write_bytes(content)
        return target

    @staticmethod
    def _format_amount(importo, valuta):
        if importo is None:
            return "non trovato"
        return "{0:.2f} {1}".format(importo, valuta or "EUR")
