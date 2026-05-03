from datetime import datetime
from typing import Optional

from sqlalchemy import desc, select
from sqlalchemy.orm import joinedload

from app.db.models import Reminder


class ReminderRepository:
    def __init__(self, session):
        self.session = session

    def create(self, **kwargs) -> Reminder:
        reminder = Reminder(**kwargs)
        self.session.add(reminder)
        self.session.flush()
        self.session.refresh(reminder)
        return reminder

    def get(self, reminder_id: str) -> Optional[Reminder]:
        return self.session.get(Reminder, reminder_id)

    def get_by_document_id(self, document_id: str) -> Optional[Reminder]:
        statement = select(Reminder).where(Reminder.document_id == document_id).order_by(desc(Reminder.created_at)).limit(1)
        return self.session.scalars(statement).first()

    def list_recent(self, limit: int = 50):
        statement = select(Reminder).order_by(desc(Reminder.created_at)).limit(limit)
        return list(self.session.scalars(statement))

    def list_pending_due(self, due_before: datetime, limit: int = 100):
        statement = (
            select(Reminder)
            .options(joinedload(Reminder.user), joinedload(Reminder.document))
            .where(Reminder.status == "pending", Reminder.remind_at <= due_before)
            .order_by(Reminder.remind_at.asc())
            .limit(limit)
        )
        return list(self.session.scalars(statement))

    def mark_sent(self, reminder: Reminder, sent_at: datetime):
        reminder.status = "sent"
        reminder.sent_at = sent_at
        self.session.add(reminder)
        self.session.flush()
        return reminder

