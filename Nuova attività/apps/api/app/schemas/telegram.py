from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class TelegramChat(BaseModel):
    id: int
    type: str


class TelegramUserPayload(BaseModel):
    id: int
    is_bot: bool = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None


class TelegramPhotoSize(BaseModel):
    file_id: str
    file_unique_id: str
    width: int
    height: int
    file_size: Optional[int] = None


class TelegramDocumentAttachment(BaseModel):
    file_id: str
    file_unique_id: str
    file_name: Optional[str] = None
    mime_type: Optional[str] = None
    file_size: Optional[int] = None


class TelegramMessage(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    message_id: int
    from_user: TelegramUserPayload = Field(alias="from")
    chat: TelegramChat
    text: Optional[str] = None
    photo: List[TelegramPhotoSize] = Field(default_factory=list)
    document: Optional[TelegramDocumentAttachment] = None


class TelegramCallbackMessage(BaseModel):
    message_id: int
    chat: TelegramChat


class TelegramCallbackQuery(BaseModel):
    id: str
    from_user: TelegramUserPayload = Field(alias="from")
    data: Optional[str] = None
    message: Optional[TelegramCallbackMessage] = None

    model_config = ConfigDict(populate_by_name=True)


class TelegramUpdate(BaseModel):
    update_id: int
    message: Optional[TelegramMessage] = None
    callback_query: Optional[TelegramCallbackQuery] = None

