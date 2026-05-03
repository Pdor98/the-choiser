from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def normalize_database_url(database_url: str) -> str:
    if database_url.startswith("sqlite+aiosqlite:///"):
        return database_url.replace("sqlite+aiosqlite:///", "sqlite:///", 1)
    if database_url.startswith("sqlite+aiosqlite://"):
        return database_url.replace("sqlite+aiosqlite://", "sqlite://", 1)
    if database_url.startswith("postgresql+asyncpg://"):
        return database_url.replace("postgresql+asyncpg://", "postgresql+psycopg://", 1)
    return database_url


def create_engine_and_session_factory(database_url: str, echo: bool = False):
    normalized_url = normalize_database_url(database_url)
    connect_args = {}
    if normalized_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False

    engine = create_engine(
        normalized_url,
        future=True,
        echo=echo,
        connect_args=connect_args,
    )
    session_factory = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
        expire_on_commit=False,
    )
    return engine, session_factory


def init_db(database_url: str = "", echo: bool = False):
    if not database_url:
        from app.config import get_settings

        settings = get_settings()
        database_url = settings.database_url
        echo = settings.sqlalchemy_echo

    from app.models import Base

    engine, session_factory = create_engine_and_session_factory(database_url, echo=echo)
    Base.metadata.create_all(bind=engine)
    return engine, session_factory
