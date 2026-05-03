from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import Optional

from app.repositories.documents import DocumentRepository
from app.repositories.users import UserRepository


def _format_date(value: Optional[date]) -> str:
    return value.isoformat() if value else "non trovata"


def _format_amount(value: Optional[Decimal]) -> str:
    if value is None:
        return "non trovato"
    normalized = "{0:.2f}".format(value)
    return normalized.replace(".", ",") + " EUR"


@dataclass
class ProcessedDocumentResult:
    document_id: str
    tipo_documento: str
    fornitore: Optional[str]
    importo: Optional[Decimal]
    data_documento: Optional[date]
    data_scadenza: Optional[date]
    categoria: Optional[str]
    azione_consigliata: Optional[str]

    def build_summary_text(self, reminder_days_before: int) -> str:
        lines = [
            "Documento analizzato con successo.",
            "",
            "Riepilogo:",
            "- Tipo documento: {0}".format(self.tipo_documento),
            "- Fornitore: {0}".format(self.fornitore or "non trovato"),
            "- Importo: {0}".format(_format_amount(self.importo)),
            "- Data documento: {0}".format(_format_date(self.data_documento)),
            "- Data scadenza: {0}".format(_format_date(self.data_scadenza)),
            "- Categoria: {0}".format(self.categoria or "non trovata"),
            "- Azione consigliata: {0}".format(self.azione_consigliata or "nessuna"),
        ]
        if self.data_scadenza:
            lines.extend(
                [
                    "",
                    "Vuoi creare un promemoria {0} giorni prima della scadenza?".format(reminder_days_before),
                ]
            )
        else:
            lines.extend(
                [
                    "",
                    "Non ho trovato una data di scadenza, quindi il reminder automatico non puo essere programmato.",
                ]
            )
        return "\n".join(lines)


class DocumentPipelineService:
    def __init__(self, session_factory, storage_service, telegram_bot_service, ai_extraction_service):
        self.session_factory = session_factory
        self.storage_service = storage_service
        self.telegram_bot_service = telegram_bot_service
        self.ai_extraction_service = ai_extraction_service

    def process_telegram_file(
        self,
        telegram_user_id: int,
        chat_id: int,
        username: Optional[str],
        first_name: Optional[str],
        last_name: Optional[str],
        telegram_file_id: str,
        file_name: str,
        mime_type: str,
    ) -> ProcessedDocumentResult:
        file_info = self.telegram_bot_service.get_file(telegram_file_id)
        content = self.telegram_bot_service.download_file(file_info["file_path"])
        temp_path = self.storage_service.save_bytes(file_name=file_name, content=content)

        try:
            extraction = self.ai_extraction_service.extract_document(
                file_name=file_name,
                mime_type=mime_type,
                content=content,
            )

            with self.session_factory() as session:
                user_repo = UserRepository(session)
                document_repo = DocumentRepository(session)

                user = user_repo.upsert_telegram_user(
                    telegram_user_id=telegram_user_id,
                    chat_id=chat_id,
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                )
                document = document_repo.create(
                    user_id=user.id,
                    telegram_file_id=telegram_file_id,
                    file_name=file_name,
                    mime_type=mime_type,
                    tipo_documento=extraction.tipo_documento,
                    fornitore=extraction.fornitore,
                    importo=extraction.importo,
                    data_documento=extraction.data_documento,
                    data_scadenza=extraction.data_scadenza,
                    categoria=extraction.categoria,
                    azione_consigliata=extraction.azione_consigliata,
                    raw_extraction=extraction.model_dump(mode="json"),
                    reminder_status="eligible" if extraction.data_scadenza else "missing_due_date",
                )
                session.commit()

                return ProcessedDocumentResult(
                    document_id=document.id,
                    tipo_documento=document.tipo_documento,
                    fornitore=document.fornitore,
                    importo=document.importo,
                    data_documento=document.data_documento,
                    data_scadenza=document.data_scadenza,
                    categoria=document.categoria,
                    azione_consigliata=document.azione_consigliata,
                )
        finally:
            self.storage_service.delete(temp_path)

