from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import Settings, get_settings
from app.db.models import Base
from app.db.session import create_engine_and_session_factory
from app.services.ai_extraction import AIExtractionService
from app.services.document_pipeline import DocumentPipelineService
from app.services.jarvis_cloud import JarvisCloudService
from app.services.reminder_service import ReminderScheduler, ReminderService
from app.services.storage import StorageService
from app.services.telegram_bot import TelegramBotService
from app.services.telegram_handler import TelegramUpdateHandler


def create_app(settings=None):
    app_settings = settings or get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        engine, session_factory = create_engine_and_session_factory(
            app_settings.database_url,
            echo=app_settings.sqlalchemy_echo,
        )
        Base.metadata.create_all(bind=engine)

        storage_service = StorageService(app_settings.storage_dir)
        telegram_bot_service = TelegramBotService(app_settings)
        ai_extraction_service = AIExtractionService(app_settings)
        jarvis_cloud_service = JarvisCloudService(app_settings)
        document_pipeline_service = DocumentPipelineService(
            session_factory=session_factory,
            storage_service=storage_service,
            telegram_bot_service=telegram_bot_service,
            ai_extraction_service=ai_extraction_service,
        )
        reminder_service = ReminderService(
            settings=app_settings,
            session_factory=session_factory,
            telegram_bot_service=telegram_bot_service,
        )
        telegram_handler = TelegramUpdateHandler(
            settings=app_settings,
            telegram_bot_service=telegram_bot_service,
            document_pipeline_service=document_pipeline_service,
            reminder_service=reminder_service,
        )
        scheduler = ReminderScheduler(
            settings=app_settings,
            reminder_service=reminder_service,
        )
        scheduler.start()

        app.state.settings = app_settings
        app.state.engine = engine
        app.state.session_factory = session_factory
        app.state.storage_service = storage_service
        app.state.telegram_bot_service = telegram_bot_service
        app.state.ai_extraction_service = ai_extraction_service
        app.state.jarvis_cloud_service = jarvis_cloud_service
        app.state.document_pipeline_service = document_pipeline_service
        app.state.reminder_service = reminder_service
        app.state.telegram_handler = telegram_handler
        app.state.reminder_scheduler = scheduler

        try:
            yield
        finally:
            scheduler.stop()
            engine.dispose()

    app = FastAPI(
        title=app_settings.app_name,
        version="0.1.0",
        lifespan=lifespan,
    )
    app.include_router(api_router, prefix=app_settings.api_prefix)
    return app


app = create_app()
