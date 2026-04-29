from pathlib import Path
import sys

import pytest
from fastapi.testclient import TestClient

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.config import Settings
from app.main import create_app


@pytest.fixture
def test_settings(tmp_path):
    return Settings(
        app_env="test",
        database_url="sqlite+aiosqlite:///{0}".format(tmp_path / "custodeai-test.db"),
        uploads_dir=str(tmp_path / "uploads"),
        whatsapp_verify_token="verify-token",
        reminder_poll_seconds=300,
        enable_reminder_worker=False,
        openai_api_key="",
    )


@pytest.fixture
def client(test_settings):
    app = create_app(test_settings)
    with TestClient(app) as test_client:
        yield test_client
