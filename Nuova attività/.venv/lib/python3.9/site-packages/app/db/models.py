from datetime import date, datetime, timezone
from decimal import Decimal
import uuid

from sqlalchemy import BigInteger, Date, DateTime, ForeignKey, Numeric, String, Text
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


class TelegramUser(TimestampMixin, Base):
    __tablename__ = "telegram_users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    telegram_user_id: Mapped[int] = mapped_column(BigInteger, unique=True, index=True, nullable=False)
    chat_id: Mapped[int] = mapped_column(BigInteger, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(255), nullable=True)
    first_name: Mapped[str] = mapped_column(String(255), nullable=True)
    last_name: Mapped[str] = mapped_column(String(255), nullable=True)

    documents: Mapped[list["Document"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    reminders: Mapped[list["Reminder"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Document(TimestampMixin, Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(ForeignKey("telegram_users.id", ondelete="CASCADE"), nullable=False, index=True)
    telegram_file_id: Mapped[str] = mapped_column(String(255), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(120), nullable=False)
    tipo_documento: Mapped[str] = mapped_column(String(80), nullable=False)
    fornitore: Mapped[str] = mapped_column(String(255), nullable=True)
    importo: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=True)
    data_documento: Mapped[date] = mapped_column(Date, nullable=True)
    data_scadenza: Mapped[date] = mapped_column(Date, nullable=True, index=True)
    categoria: Mapped[str] = mapped_column(String(80), nullable=True)
    azione_consigliata: Mapped[str] = mapped_column(Text, nullable=True)
    raw_extraction: Mapped[dict] = mapped_column(JSON, nullable=False)
    reminder_status: Mapped[str] = mapped_column(String(40), nullable=False, default="not_requested")

    user: Mapped[TelegramUser] = relationship(back_populates="documents")
    reminders: Mapped[list["Reminder"]] = relationship(back_populates="document", cascade="all, delete-orphan")


class Reminder(TimestampMixin, Base):
    __tablename__ = "reminders"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("telegram_users.id", ondelete="CASCADE"), nullable=False, index=True)
    remind_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(40), nullable=False, default="pending")
    sent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)

    document: Mapped[Document] = relationship(back_populates="reminders")
    user: Mapped[TelegramUser] = relationship(back_populates="reminders")
