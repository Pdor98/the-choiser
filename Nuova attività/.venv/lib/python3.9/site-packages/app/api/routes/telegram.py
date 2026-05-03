from fastapi import APIRouter, Depends, Header, HTTPException, Request

from app.api.deps import get_settings, get_telegram_handler
from app.schemas.documents import TelegramWebhookResponse

router = APIRouter(prefix="/telegram")


@router.post("/webhook", response_model=TelegramWebhookResponse)
def telegram_webhook(
    request: Request,
    payload: dict,
    secret_token=Header(default=None, alias="X-Telegram-Bot-Api-Secret-Token"),
    settings=Depends(get_settings),
    telegram_handler=Depends(get_telegram_handler),
):
    if settings.telegram_webhook_secret and secret_token != settings.telegram_webhook_secret:
        raise HTTPException(status_code=403, detail="Invalid Telegram secret token")

    detail = telegram_handler.handle_payload(payload)
    return TelegramWebhookResponse(status="ok", detail=detail)


@router.post("/set-webhook")
def set_telegram_webhook(request: Request, settings=Depends(get_settings)):
    bot_service = request.app.state.telegram_bot_service
    webhook_url = settings.telegram_webhook_url
    result = bot_service.set_webhook(
        webhook_url,
        secret_token=settings.telegram_webhook_secret or None,
    )
    return {"status": "ok", "url": webhook_url, "result": result}

