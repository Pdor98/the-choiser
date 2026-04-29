from contextlib import asynccontextmanager
from hashlib import sha256
import hmac
import logging
from pathlib import Path
from typing import Optional

from fastapi import BackgroundTasks, FastAPI, HTTPException, Query, Request
from fastapi.responses import PlainTextResponse

from app.ai.extractor import OpenAIExtractor
from app.config import Settings, get_settings
from app.db import create_engine_and_session_factory
from app.models import Base, Reminder
from app.services.processor import BotProcessor
from app.services.reminders import ReminderService, ReminderWorker
from app.whatsapp.client import WhatsAppClient

logger = logging.getLogger(__name__)


def create_app(settings: Optional[Settings] = None) -> FastAPI:
    app_settings = settings or get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        Path(app_settings.uploads_dir).mkdir(parents=True, exist_ok=True)
        engine, session_factory = create_engine_and_session_factory(
            app_settings.database_url,
            echo=app_settings.sqlalchemy_echo,
        )
        Base.metadata.create_all(bind=engine)

        whatsapp_client = WhatsAppClient(app_settings)
        extractor = OpenAIExtractor(app_settings)
        reminder_service = ReminderService(app_settings, session_factory, whatsapp_client)
        processor = BotProcessor(
            settings=app_settings,
            session_factory=session_factory,
            whatsapp_client=whatsapp_client,
            extractor=extractor,
            reminder_service=reminder_service,
        )
        reminder_worker = ReminderWorker(app_settings, reminder_service)
        reminder_worker.start()

        app.state.settings = app_settings
        app.state.engine = engine
        app.state.session_factory = session_factory
        app.state.whatsapp_client = whatsapp_client
        app.state.extractor = extractor
        app.state.reminder_service = reminder_service
        app.state.processor = processor
        app.state.reminder_worker = reminder_worker
        try:
            yield
        finally:
            reminder_worker.stop()
            engine.dispose()

    app = FastAPI(title=app_settings.app_name, version="0.2.0", lifespan=lifespan)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    @app.get("/webhooks/whatsapp", response_class=PlainTextResponse)
    def verify_whatsapp_webhook(
        mode: str = Query(alias="hub.mode"),
        verify_token: str = Query(alias="hub.verify_token"),
        challenge: str = Query(alias="hub.challenge"),
    ):
        if mode == "subscribe" and verify_token == app_settings.whatsapp_verify_token:
            return challenge
        raise HTTPException(status_code=403, detail="Webhook verification failed")

    @app.post("/webhooks/whatsapp")
    async def receive_whatsapp_webhook(request: Request, background_tasks: BackgroundTasks):
        raw_body = await request.body()
        _ensure_valid_signature_or_raise(
            raw_body=raw_body,
            signature_header=request.headers.get("X-Hub-Signature-256"),
            settings=app_settings,
        )

        payload = await request.json()
        background_tasks.add_task(request.app.state.processor.process_webhook_payload, payload)
        return {"status": "ok"}

    @app.get("/documents")
    def list_documents(limit: int = Query(default=50, ge=1, le=100)):
        return {"items": app.state.processor.get_documents(limit=limit)}

    @app.get("/reminders")
    def list_reminders(limit: int = Query(default=50, ge=1, le=100)):
        with app.state.session_factory() as session:
            reminders = list(session.query(Reminder).order_by(Reminder.created_at.desc()).limit(limit))
            return {
                "items": [
                    {
                        "id": reminder.id,
                        "document_id": reminder.document_id,
                        "phone_number": reminder.phone_number,
                        "remind_at": reminder.remind_at.isoformat(),
                        "status": reminder.status,
                        "sent_at": reminder.sent_at.isoformat() if reminder.sent_at else None,
                        "delivery_mode": reminder.delivery_mode,
                        "created_at": reminder.created_at.isoformat(),
                    }
                    for reminder in reminders
                ]
            }

    @app.post("/documents/{document_id}/reminders")
    def create_reminder(document_id: str):
        try:
            result = app.state.reminder_service.create_reminder_for_document(document_id)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        return {
            "status": result.status,
            "message": result.message,
            "reminder_id": result.reminder_id,
            "remind_at": result.remind_at.isoformat() if result.remind_at else None,
        }

    @app.post("/reminders/dispatch")
    def dispatch_reminders():
        sent_count = app.state.reminder_service.dispatch_due_reminders()
        return {"status": "ok", "sent_count": sent_count}

    @app.get("/webhook", include_in_schema=False, response_class=PlainTextResponse)
    def legacy_verify_whatsapp_webhook(
        mode: str = Query(alias="hub.mode"),
        verify_token: str = Query(alias="hub.verify_token"),
        challenge: str = Query(alias="hub.challenge"),
    ):
        return verify_whatsapp_webhook(mode=mode, verify_token=verify_token, challenge=challenge)

    @app.post("/webhook", include_in_schema=False)
    async def legacy_receive_whatsapp_webhook(request: Request, background_tasks: BackgroundTasks):
        return await receive_whatsapp_webhook(request=request, background_tasks=background_tasks)

    return app


def _ensure_valid_signature_or_raise(raw_body: bytes, signature_header: Optional[str], settings: Settings):
    if not settings.meta_app_secret:
        if settings.is_dev:
            logger.warning("META_APP_SECRET is empty: webhook signature is not verified in %s mode.", settings.app_env)
            return
        raise HTTPException(status_code=503, detail="META_APP_SECRET is required outside development.")

    if not signature_header:
        raise HTTPException(status_code=403, detail="Missing signature header")

    expected = "sha256=" + hmac.new(settings.meta_app_secret.encode("utf-8"), raw_body, sha256).hexdigest()
    if not hmac.compare_digest(expected, signature_header):
        raise HTTPException(status_code=403, detail="Invalid signature")


app = create_app()
