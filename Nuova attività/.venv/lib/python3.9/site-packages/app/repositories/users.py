from sqlalchemy import select

from app.db.models import TelegramUser


class UserRepository:
    def __init__(self, session):
        self.session = session

    def upsert_telegram_user(self, telegram_user_id: int, chat_id: int, username=None, first_name=None, last_name=None):
        statement = select(TelegramUser).where(TelegramUser.telegram_user_id == telegram_user_id)
        user = self.session.scalars(statement).first()
        if user is None:
            user = TelegramUser(
                telegram_user_id=telegram_user_id,
                chat_id=chat_id,
                username=username,
                first_name=first_name,
                last_name=last_name,
            )
            self.session.add(user)
        else:
            user.chat_id = chat_id
            user.username = username
            user.first_name = first_name
            user.last_name = last_name

        self.session.flush()
        self.session.refresh(user)
        return user

