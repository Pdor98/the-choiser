from datetime import date, datetime, timezone
from decimal import Decimal
import uuid
from typing import Any, Dict, List, Optional

from sqlalchemy import Date, DateTime, Float, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.types import JSON


def utcnow():
    return datetime.now(timezone.utc)


def new_id() -> str:
    return str(uuid.uuid4())


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        onupdate=utcnow,
        nullable=False,
    )


class WhatsAppUser(TimestampMixin, Base):
    __tablename__ = "whatsapp_users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    wa_id: Mapped[str] = mapped_column(String(32), nullable=False, unique=True, index=True)
    profile_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    last_message_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    documents: Mapped[List["Document"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    reminders: Mapped[List["Reminder"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    processed_messages: Mapped[List["ProcessedMessage"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Document(TimestampMixin, Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(ForeignKey("whatsapp_users.id", ondelete="CASCADE"), nullable=False, index=True)
    whatsapp_message_id: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    media_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    source_kind: Mapped[str] = mapped_column(String(30), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(120), nullable=False)
    text_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tipo_documento: Mapped[str] = mapped_column(String(80), nullable=False)
    fornitore: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    importo: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    valuta: Mapped[Optional[str]] = mapped_column(String(12), nullable=True)
    data_documento: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    data_scadenza: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    categoria: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    azione_consigliata: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    riepilogo: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    confidenza: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    raw_extraction: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    raw_json: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    reminder_status: Mapped[str] = mapped_column(String(40), nullable=False, default="not_requested")

    user: Mapped["WhatsAppUser"] = relationship(back_populates="documents")
    reminders: Mapped[List["Reminder"]] = relationship(back_populates="document", cascade="all, delete-orphan")


class Reminder(TimestampMixin, Base):
    __tablename__ = "reminders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("whatsapp_users.id", ondelete="CASCADE"), nullable=False, index=True)
    phone_number: Mapped[str] = mapped_column(String(32), nullable=False)
    remind_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(40), nullable=False, default="pending")
    delivery_mode: Mapped[str] = mapped_column(String(40), nullable=False, default="text")
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)

    document: Mapped["Document"] = relationship(back_populates="reminders")
    user: Mapped["WhatsAppUser"] = relationship(back_populates="reminders")


class ProcessedMessage(TimestampMixin, Base):
    __tablename__ = "processed_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[Optional[str]] = mapped_column(ForeignKey("whatsapp_users.id", ondelete="CASCADE"), nullable=True, index=True)
    whatsapp_message_id: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    message_type: Mapped[str] = mapped_column(String(30), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="processed")
    outcome: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    raw_json: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)

    user: Mapped[Optional["WhatsAppUser"]] = relationship(back_populates="processed_messages")
