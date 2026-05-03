from typing import Optional

from sqlalchemy import desc, select

from app.db.models import Document


class DocumentRepository:
    def __init__(self, session):
        self.session = session

    def create(self, **kwargs) -> Document:
        document = Document(**kwargs)
        self.session.add(document)
        self.session.flush()
        self.session.refresh(document)
        return document

    def get(self, document_id: str) -> Optional[Document]:
        return self.session.get(Document, document_id)

    def list_recent(self, limit: int = 50):
        statement = select(Document).order_by(desc(Document.created_at)).limit(limit)
        return list(self.session.scalars(statement))

    def update_reminder_status(self, document: Document, status: str):
        document.reminder_status = status
        self.session.add(document)
        self.session.flush()
        return document

