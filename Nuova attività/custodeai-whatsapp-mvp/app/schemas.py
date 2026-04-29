from typing import List, Optional

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str


class WebhookAckResponse(BaseModel):
    status: str


class ReminderDispatchResponse(BaseModel):
    status: str
    sent_count: int


class DocumentListItem(BaseModel):
    id: str
    user_id: str
    source_kind: str
    tipo_documento: str
    fornitore: Optional[str] = None
    importo: Optional[float] = None
    valuta: Optional[str] = None
    data_documento: Optional[str] = None
    data_scadenza: Optional[str] = None
    categoria: Optional[str] = None
    azione_consigliata: Optional[str] = None
    riepilogo: Optional[str] = None
    confidenza: float
    reminder_status: str
    created_at: str


class ReminderListItem(BaseModel):
    id: str
    document_id: str
    phone_number: str
    remind_at: str
    status: str
    sent_at: Optional[str] = None
    delivery_mode: str
    created_at: str


class DocumentListResponse(BaseModel):
    items: List[DocumentListItem]


class ReminderListResponse(BaseModel):
    items: List[ReminderListItem]


class ReminderCreateResponse(BaseModel):
    status: str
    message: str
    reminder_id: Optional[str] = None
    remind_at: Optional[str] = None
