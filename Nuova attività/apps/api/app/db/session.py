from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def create_engine_and_session_factory(database_url: str, echo: bool = False):
    connect_args = {}
    if database_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False

    engine = create_engine(
        database_url,
        future=True,
        echo=echo,
        connect_args=connect_args,
    )
    session_factory = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)
    return engine, session_factory

