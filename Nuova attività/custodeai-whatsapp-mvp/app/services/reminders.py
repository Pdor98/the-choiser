from dataclasses import dataclass
from datetime import datetime, time, timedelta, timezone
import logging
from typing import Optional
from zoneinfo import ZoneInfo

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy import select

from app.models import Document, Reminder

logger = logging.getLogger(__name__)


@dataclass
class ReminderResult:
    status: str
    message: str
    reminder_id: Optional[str] = None
    remind_at: Optional[datetime] = None


class ReminderService:
    def __init__(self, settings, session_factory, whatsapp_client):
        self.settings = settings
        self.session_factory = session_factory
        self.whatsapp_client = whatsapp_client

    def create_reminder_for_document(self, document_id: str) -> ReminderResult:
        with self.session_factory() as session:
            document = session.get(Document, document_id)
            if document is None:
                raise ValueError("Documento non trovato.")
            if document.data_scadenza is None:
                document.reminder_status = "missing_due_date"
                session.add(document)
                session.commit()
                raise ValueError("Non posso creare un promemoria senza data di scadenza.")

            existing = session.execute(
                select(Reminder).where(Reminder.document_id == document_id).order_by(Reminder.created_at.desc()).limit(1)
            ).scalars().first()
            if existing and existing.status in ("pending", "sent", "needs_template"):
                return ReminderResult(
                    status="already_exists",
                    message="Esiste gia un promemoria per questo documento.",
                    reminder_id=existing.id,
                    remind_at=existing.remind_at,
                )

            remind_at = self._compute_remind_at(document.data_scadenza)
            reminder = Reminder(
                document_id=document.id,
                user_id=document.user_id,
                phone_number=document.user.wa_id,
                remind_at=remind_at,
                status="pending",
                delivery_mode="template" if self.settings.whatsapp_reminder_template_name else "text",
                message=self._build_reminder_message(document),
            )
            document.reminder_status = "scheduled"
            session.add(reminder)
            session.add(document)
            session.commit()
            session.refresh(reminder)

            return ReminderResult(
                status="created",
                message="Promemoria creato per {0}.".format(
                    reminder.remind_at.astimezone(self._local_tz).strftime("%Y-%m-%d %H:%M %Z")
                ),
                reminder_id=reminder.id,
                remind_at=reminder.remind_at,
            )

    def skip_reminder_for_document(self, document_id: str) -> ReminderResult:
        with self.session_factory() as session:
            document = session.get(Document, document_id)
            if document is None:
                raise ValueError("Documento non trovato.")
            document.reminder_status = "skipped"
            session.add(document)
            session.commit()
            return ReminderResult(status="skipped", message="Promemoria non creato.")

    def dispatch_due_reminders(self) -> int:
        due_before = datetime.now(timezone.utc)
        sent_count = 0

        with self.session_factory() as session:
            reminders = list(
                session.execute(
                    select(Reminder)
                    .where(Reminder.status == "pending", Reminder.remind_at <= due_before)
                    .order_by(Reminder.remind_at.asc())
                ).scalars()
            )

            for reminder in reminders:
                try:
                    if self._can_send_freeform(reminder):
                        self.whatsapp_client.send_text_message(to=reminder.phone_number, body=reminder.message)
                        reminder.delivery_mode = "text"
                    elif self.settings.whatsapp_reminder_template_name:
                        document = reminder.document
                        self.whatsapp_client.send_template_message(
                            to=reminder.phone_number,
                            template_name=self.settings.whatsapp_reminder_template_name,
                            language=self.settings.whatsapp_template_language,
                            parameters=[
                                document.tipo_documento,
                                document.fornitore or "fornitore sconosciuto",
                                document.data_scadenza.isoformat() if document.data_scadenza else "n.d.",
                            ],
                        )
                        reminder.delivery_mode = "template"
                    else:
                        reminder.status = "needs_template"
                        reminder.document.reminder_status = "needs_template"
                        session.add(reminder)
                        session.add(reminder.document)
                        session.commit()
                        continue

                    reminder.status = "sent"
                    reminder.sent_at = due_before
                    reminder.document.reminder_status = "sent"
                    session.add(reminder)
                    session.add(reminder.document)
                    session.commit()
                    sent_count += 1
                except Exception:
                    logger.exception("Reminder dispatch failed for reminder_id=%s", reminder.id)
                    session.rollback()

        return sent_count

    def _can_send_freeform(self, reminder: Reminder) -> bool:
        last_message_at = reminder.user.last_message_at
        if last_message_at is None:
            return False
        return datetime.now(timezone.utc) - last_message_at <= timedelta(hours=24)

    def _build_reminder_message(self, document: Document) -> str:
        due_date = document.data_scadenza.isoformat() if document.data_scadenza else "sconosciuta"
        amount = "importo non disponibile"
        if document.importo is not None:
            amount = "{0:.2f} {1}".format(document.importo, document.valuta or "EUR")

        return (
            "Promemoria CustodeAI\n"
            "Documento: {tipo}\n"
            "Fornitore: {fornitore}\n"
            "Importo: {importo}\n"
            "Scadenza: {scadenza}\n"
            "Azione consigliata: {azione}"
        ).format(
            tipo=document.tipo_documento,
            fornitore=document.fornitore or "non trovato",
            importo=amount,
            scadenza=due_date,
            azione=document.azione_consigliata or "verifica il documento",
        )

    def _compute_remind_at(self, due_date):
        reminder_date = due_date - timedelta(days=self.settings.reminder_default_days_before)
        local_dt = datetime.combine(
            reminder_date,
            time(hour=self.settings.reminder_hour, minute=self.settings.reminder_minute),
            tzinfo=self._local_tz,
        )
        remind_at = local_dt.astimezone(timezone.utc)
        if remind_at < datetime.now(timezone.utc):
            return datetime.now(timezone.utc)
        return remind_at

    @property
    def _local_tz(self):
        return ZoneInfo(self.settings.timezone)


class ReminderWorker:
    def __init__(self, settings, reminder_service: ReminderService):
        self.settings = settings
        self.reminder_service = reminder_service
        self.scheduler = BackgroundScheduler(timezone=settings.timezone)

    def start(self):
        if not self.settings.enable_reminder_worker:
            logger.info("Reminder worker disabled by configuration.")
            return
        if self.scheduler.running:
            return
        self.scheduler.add_job(
            self.reminder_service.dispatch_due_reminders,
            trigger="interval",
            seconds=self.settings.reminder_poll_seconds,
            id="custodeai-whatsapp-reminders",
            replace_existing=True,
        )
        self.scheduler.start()

    def stop(self):
        if self.scheduler.running:
            self.scheduler.shutdown(wait=False)
