import logging
from dataclasses import dataclass
from typing import Dict, List, Optional

import httpx

logger = logging.getLogger(__name__)


class WhatsAppClientError(RuntimeError):
    pass


@dataclass
class DownloadedMedia:
    media_id: str
    file_name: str
    mime_type: str
    content: bytes


class WhatsAppClient:
    def __init__(self, settings):
        self.settings = settings
        self.api_base = settings.graph_api_base
        self.access_token = settings.whatsapp_access_token
        self.phone_number_id = settings.whatsapp_phone_number_id
        self.timeout = 30.0

    def send_text_message(self, to: str, body: str, preview_url: bool = False):
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "text",
            "text": {
                "body": body,
                "preview_url": preview_url,
            },
        }
        return self._post_messages(payload, action="sending text message")

    def send_template_message(
        self,
        to: str,
        template_name: str,
        language: str,
        parameters: Optional[List[str]] = None,
    ):
        template = {
            "name": template_name,
            "language": {"code": language},
        }
        if parameters:
            template["components"] = [
                {
                    "type": "body",
                    "parameters": [{"type": "text", "text": value} for value in parameters],
                }
            ]

        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "template",
            "template": template,
        }
        return self._post_messages(payload, action="sending template message")

    def send_interactive_buttons(self, to: str, body_text: str, buttons: List[Dict[str, object]]):
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "interactive",
            "interactive": {
                "type": "button",
                "body": {"text": body_text},
                "action": {"buttons": buttons},
            },
        }
        return self._post_messages(payload, action="sending interactive message")

    def get_media_metadata(self, media_id: str) -> Dict[str, object]:
        self._ensure_access_token()
        response = httpx.get(
            "{0}/{1}".format(self.api_base, media_id),
            headers=self._headers(),
            timeout=self.timeout,
        )
        self._raise_for_status(response, action="retrieving media metadata")
        return response.json()

    def get_media_url(self, media_id: str) -> str:
        metadata = self.get_media_metadata(media_id)
        media_url = metadata.get("url")
        if not media_url:
            raise WhatsAppClientError("WhatsApp media metadata did not include a download URL.")
        return str(media_url)

    def download_media(self, media_id: str, fallback_file_name: Optional[str] = None) -> DownloadedMedia:
        metadata = self.get_media_metadata(media_id)
        media_url = metadata.get("url")
        if not media_url:
            raise WhatsAppClientError("WhatsApp media metadata did not include a download URL.")

        mime_type = metadata.get("mime_type") or "application/octet-stream"
        file_name = metadata.get("filename") or fallback_file_name or "{0}".format(media_id)
        response = httpx.get(str(media_url), headers=self._headers(), timeout=self.timeout)
        self._raise_for_status(response, action="downloading media")
        return DownloadedMedia(
            media_id=media_id,
            file_name=str(file_name),
            mime_type=str(mime_type),
            content=response.content,
        )

    def _post_messages(self, payload: dict, action: str):
        self._ensure_access_token()
        self._ensure_phone_number_id()
        response = httpx.post(
            "{0}/{1}/messages".format(self.api_base, self.phone_number_id),
            headers=self._headers(),
            json=payload,
            timeout=self.timeout,
        )
        self._raise_for_status(response, action=action)
        return response.json()

    def _headers(self):
        return {
            "Authorization": "Bearer {0}".format(self.access_token),
            "Content-Type": "application/json",
        }

    def _raise_for_status(self, response: httpx.Response, action: str):
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            status_code = exc.response.status_code if exc.response is not None else "unknown"
            logger.warning("WhatsApp API error while %s: HTTP %s", action, status_code)
            raise WhatsAppClientError("WhatsApp API error while {0}: HTTP {1}".format(action, status_code)) from exc
        except httpx.HTTPError as exc:
            logger.warning("WhatsApp API network error while %s", action)
            raise WhatsAppClientError("WhatsApp API network error while {0}.".format(action)) from exc

    def _ensure_access_token(self):
        if not self.access_token:
            raise WhatsAppClientError("WHATSAPP_ACCESS_TOKEN is not configured")

    def _ensure_phone_number_id(self):
        if not self.phone_number_id:
            raise WhatsAppClientError("WHATSAPP_PHONE_NUMBER_ID is not configured")
