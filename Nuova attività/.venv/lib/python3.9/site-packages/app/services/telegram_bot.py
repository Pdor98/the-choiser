import httpx


class TelegramBotService:
    def __init__(self, settings):
        self.token = settings.telegram_bot_token
        self.api_base = "https://api.telegram.org"
        self.timeout = 30.0

    def get_file(self, file_id: str):
        return self._post("getFile", {"file_id": file_id})

    def download_file(self, file_path: str) -> bytes:
        self._ensure_token()
        url = "{0}/file/bot{1}/{2}".format(self.api_base, self.token, file_path)
        response = httpx.get(url, timeout=self.timeout)
        response.raise_for_status()
        return response.content

    def send_message(self, chat_id: int, text: str, reply_markup=None):
        payload = {
            "chat_id": chat_id,
            "text": text,
        }
        if reply_markup is not None:
            payload["reply_markup"] = reply_markup
        return self._post("sendMessage", payload)

    def answer_callback_query(self, callback_query_id: str, text: str = ""):
        payload = {"callback_query_id": callback_query_id}
        if text:
            payload["text"] = text
        return self._post("answerCallbackQuery", payload)

    def set_webhook(self, webhook_url: str, secret_token=None):
        payload = {"url": webhook_url}
        if secret_token:
            payload["secret_token"] = secret_token
        return self._post("setWebhook", payload)

    @staticmethod
    def build_reminder_keyboard(document_id: str):
        return {
            "inline_keyboard": [
                [
                    {"text": "Crea promemoria", "callback_data": "reminder:create:{0}".format(document_id)},
                    {"text": "Salta", "callback_data": "reminder:skip:{0}".format(document_id)},
                ]
            ]
        }

    def _post(self, method: str, payload: dict):
        self._ensure_token()
        url = "{0}/bot{1}/{2}".format(self.api_base, self.token, method)
        response = httpx.post(url, json=payload, timeout=self.timeout)
        response.raise_for_status()
        body = response.json()
        if not body.get("ok"):
            raise RuntimeError("Telegram API error: {0}".format(body))
        return body["result"]

    def _ensure_token(self):
        if not self.token:
            raise RuntimeError("TELEGRAM_BOT_TOKEN is not configured")

