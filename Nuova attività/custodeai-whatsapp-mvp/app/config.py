from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "CustodeAI WhatsApp MVP"
    app_env: str = "dev"
    public_base_url: str = "http://localhost:8000"
    database_url: str = "sqlite+aiosqlite:///./custodeai.db"
    uploads_dir: str = "./uploads"
    timezone: str = "Europe/Rome"

    whatsapp_verify_token: str = "custodeai12345"
    whatsapp_access_token: str = ""
    whatsapp_phone_number_id: str = ""
    whatsapp_api_version: str = "v24.0"
    meta_app_secret: str = ""

    whatsapp_reminder_template_name: str = "custode_reminder_scadenza"
    whatsapp_template_language: str = "it"
    reminder_default_days_before: int = Field(default=3, ge=0, le=365)
    reminder_poll_seconds: int = Field(default=60, ge=15, le=3600)
    reminder_hour: int = Field(default=9, ge=0, le=23)
    reminder_minute: int = Field(default=0, ge=0, le=59)
    enable_reminder_worker: bool = False

    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"

    sqlalchemy_echo: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def graph_api_base(self) -> str:
        return "https://graph.facebook.com/{0}".format(self.whatsapp_api_version)

    @property
    def uploads_path(self) -> Path:
        return Path(self.uploads_dir)

    @property
    def is_dev(self) -> bool:
        return self.app_env.lower() in ("dev", "development", "local", "test")


@lru_cache
def get_settings() -> Settings:
    return Settings()
