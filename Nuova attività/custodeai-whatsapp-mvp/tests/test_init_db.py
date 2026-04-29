from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.config import get_settings
from scripts import init_db


def test_init_db(monkeypatch, tmp_path):
    db_path = tmp_path / "init-test.db"
    uploads_path = tmp_path / "uploads"

    monkeypatch.setenv("DATABASE_URL", "sqlite+aiosqlite:///{0}".format(db_path))
    monkeypatch.setenv("UPLOADS_DIR", str(uploads_path))
    get_settings.cache_clear()

    init_db.main()

    assert db_path.exists()
    assert uploads_path.exists()

    get_settings.cache_clear()
