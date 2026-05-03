from datetime import date, datetime
from decimal import Decimal, ROUND_HALF_UP
import re
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator


def _parse_decimal(value) -> Optional[Decimal]:
    if value in (None, ""):
        return None

    if isinstance(value, Decimal):
        return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    if isinstance(value, (int, float)):
        return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    cleaned = re.sub(r"[^0-9,.\-]", "", str(value))
    if not cleaned:
        return None

    if "," in cleaned and "." in cleaned:
        cleaned = cleaned.replace(".", "").replace(",", ".")
    else:
        cleaned = cleaned.replace(",", ".")

    return Decimal(cleaned).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class ExtractedDocumentData(BaseModel):
    tipo_documento: str
    fornitore: Optional[str] = None
    importo: Optional[Decimal] = None
    data_documento: Optional[date] = None
    data_scadenza: Optional[date] = None
    categoria: Optional[str] = None
    azione_consigliata: Optional[str] = None

    @field_validator("importo", mode="before")
    @classmethod
    def normalize_importo(cls, value):
        return _parse_decimal(value)

    @field_validator("data_documento", "data_scadenza", mode="before")
    @classmethod
    def normalize_date(cls, value):
        if value in (None, ""):
            return None
        if isinstance(value, date):
            return value
        return date.fromisoformat(str(value))


class DocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    telegram_file_id: str
    file_name: str
    mime_type: str
    tipo_documento: str
    fornitore: Optional[str] = None
    importo: Optional[Decimal] = None
    data_documento: Optional[date] = None
    data_scadenza: Optional[date] = None
    categoria: Optional[str] = None
    azione_consigliata: Optional[str] = None
    reminder_status: str
    created_at: datetime


class ReminderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str
    user_id: str
    remind_at: datetime
    status: str
    sent_at: Optional[datetime] = None
    message: str
    created_at: datetime


class ReminderActionResponse(BaseModel):
    status: str
    message: str
    reminder_id: Optional[str] = None
    remind_at: Optional[datetime] = None


class TelegramWebhookResponse(BaseModel):
    status: str
    detail: str

