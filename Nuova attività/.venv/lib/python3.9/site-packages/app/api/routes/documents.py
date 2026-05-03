from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.deps import get_reminder_service, get_session_factory
from app.repositories.documents import DocumentRepository
from app.repositories.reminders import ReminderRepository
from app.schemas.documents import DocumentRead, ReminderActionResponse, ReminderRead

router = APIRouter()


@router.get("/documents", response_model=List[DocumentRead])
def list_documents(
    limit: int = Query(default=50, ge=1, le=100),
    session_factory=Depends(get_session_factory),
):
    with session_factory() as session:
        documents = DocumentRepository(session).list_recent(limit=limit)
        return [DocumentRead.model_validate(document) for document in documents]


@router.get("/documents/{document_id}", response_model=DocumentRead)
def get_document(document_id: str, session_factory=Depends(get_session_factory)):
    with session_factory() as session:
        document = DocumentRepository(session).get(document_id)
        if document is None:
            raise HTTPException(status_code=404, detail="Document not found")
        return DocumentRead.model_validate(document)


@router.post("/documents/{document_id}/reminders", response_model=ReminderActionResponse)
def create_reminder_for_document(document_id: str, reminder_service=Depends(get_reminder_service)):
    try:
        result = reminder_service.create_reminder_for_document(document_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return ReminderActionResponse(
        status=result.status,
        message=result.message,
        reminder_id=result.reminder_id,
        remind_at=result.remind_at,
    )


@router.get("/reminders", response_model=List[ReminderRead])
def list_reminders(
    limit: int = Query(default=50, ge=1, le=100),
    session_factory=Depends(get_session_factory),
):
    with session_factory() as session:
        reminders = ReminderRepository(session).list_recent(limit=limit)
        return [ReminderRead.model_validate(reminder) for reminder in reminders]

