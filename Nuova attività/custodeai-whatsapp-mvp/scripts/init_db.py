from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.config import get_settings
from app.db import create_engine_and_session_factory
from app.models import Base


def main():
    settings = get_settings()
    settings.uploads_path.mkdir(parents=True, exist_ok=True)
    engine, _ = create_engine_and_session_factory(settings.database_url, echo=settings.sqlalchemy_echo)
    Base.metadata.create_all(bind=engine)
    print("Database initialized for {0}".format(settings.database_url))


if __name__ == "__main__":
    main()
