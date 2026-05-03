from dataclasses import dataclass
from datetime import datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

from apscheduler.schedulers.background import BackgroundScheduler

from app.repositories.documents import DocumentRepository
from app.repositories.reminders import ReminderRepository


@dataclass
class ReminderCreationResult:
    status: str
    message: str
    reminder_id: str = None
    remind_at: datetime = None


class ReminderService:
    def __init__(self, settings, session_factory, telegram_bot_service):
        self.settings = settings
        self.session_factory = session_factory
        self.telegram_bot_service = telegram_bot_service

    def create_reminder_for_document(self, document_id: str) -> ReminderCreationResult:
        with self.session_factory() as session:
            document_repo = DocumentRepository(session)
            reminder_repo = ReminderRepository(session)

            document = document_repo.get(document_id)
            if document is None:
                raise ValueError("Document not found")
            if document.data_scadenza is None:
                document_repo.update_reminder_status(document, "missing_due_date")
                session.commit()
                raise ValueError("Cannot create a reminder without data_scadenza")

            existing = reminder_repo.get_by_document_id(document_id)
            if existing and existing.status in ("pending", "sent"):
                return ReminderCreationResult(
                    status="already_exists",
                    message="Esiste gia un promemoria per questo documento.",
                    reminder_id=existing.id,
                    remind_at=existing.remind_at,
                )

            remind_at = self._compute_remind_at(document.data_scadenza)
            message = self._build_reminder_message(document)
            reminder = reminder_repo.create(
                document_id=document.id,
                user_id=document.user_id,
                remind_at=remind_at,
                status="pending",
                message=message,
            )
            document_repo.update_reminder_status(document, "scheduled")
            session.commit()

            return ReminderCreationResult(
                status="created",
                message="Promemoria creato per {0}.".format(remind_at.astimezone(self._local_tz).strftime("%Y-%m-%d %H:%M %Z")),
                reminder_id=reminder.id,
                remind_at=remind_at,
            )

    def skip_reminder_for_document(self, document_id: str):
        with self.session_factory() as session:
            document_repo = DocumentRepository(session)
            document = document_repo.get(document_id)
            if document is None:
                raise ValueError("Document not found")
            document_repo.update_reminder_status(document, "skipped")
            session.commit()

    def dispatch_due_reminders(self) -> int:
        sent_count = 0
        due_before = datetime.now(timezone.utc)

        with self.session_factory() as session:
            reminder_repo = ReminderRepository(session)
            document_repo = DocumentRepository(session)
            reminders = reminder_repo.list_pending_due(due_before=due_before, limit=100)

            for reminder in reminders:
                try:
                    self.telegram_bot_service.send_message(
                        chat_id=reminder.user.chat_id,
                        text=reminder.message,
                    )
                    reminder_repo.mark_sent(reminder, sent_at=due_before)
                    document_repo.update_reminder_status(reminder.document, "sent")
                    session.commit()
                    sent_count += 1
                except Exception:
                    session.rollback()

        return sent_count

    def _build_reminder_message(self, document) -> str:
        due_date = document.data_scadenza.isoformat() if document.data_scadenza else "sconosciuta"
        supplier = document.fornitore or "fornitore non identificato"
        amount = "importo non disponibile"
        if document.importo is not None:
            amount = "{0:.2f} EUR".format(document.importo)

        return (
            "Promemoria CustodeAI\n"
            "Documento: {tipo}\n"
            "Fornitore: {fornitore}\n"
            "Importo: {importo}\n"
            "Scadenza: {scadenza}\n"
            "Azione consigliata: {azione}"
        ).format(
            tipo=document.tipo_documento,
            fornitore=supplier,
            importo=amount,
            scadenza=due_date,
            azione=document.azione_consigliata or "verifica il documento",
        )

    @property
    def _local_tz(self):
        return ZoneInfo(self.settings.default_timezone)

    def _compute_remind_at(self, due_date):
        reminder_date = due_date - timedelta(days=self.settings.reminder_days_before)
        local_dt = datetime.combine(
            reminder_date,
            time(hour=self.settings.reminder_hour, minute=self.settings.reminder_minute),
            tzinfo=self._local_tz,
        )
        return local_dt.astimezone(timezone.utc)


class ReminderScheduler:
    def __init__(self, settings, reminder_service: ReminderService):
        self.reminder_service = reminder_service
        self.scheduler = BackgroundScheduler(timezone=settings.default_timezone)
        self.poll_seconds = settings.scheduler_poll_seconds

    def start(self):
        if self.scheduler.running:
            return

        self.scheduler.add_job(
            self.reminder_service.dispatch_due_reminders,
            trigger="interval",
            seconds=self.poll_seconds,
            id="custodeai-dispatch-reminders",
            replace_existing=True,
        )
        self.scheduler.start()

    def stop(self):
        if self.scheduler.running:
            self.scheduler.shutdown(wait=False)

