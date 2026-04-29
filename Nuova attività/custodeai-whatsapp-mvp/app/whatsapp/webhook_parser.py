from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class InboundWhatsAppEvent(BaseModel):
    event_type: str
    message_type: str
    message_id: str
    from_number: str
    profile_name: Optional[str] = None
    timestamp: datetime
    text: Optional[str] = None
    media_id: Optional[str] = None
    mime_type: Optional[str] = None
    file_name: Optional[str] = None
    button_id: Optional[str] = None
    raw_message: Dict[str, Any]


class WhatsAppWebhookParser:
    def parse(self, payload: Dict[str, Any]) -> List[InboundWhatsAppEvent]:
        if not isinstance(payload, dict):
            return []

        events = []
        for entry in payload.get("entry", []) or []:
            if not isinstance(entry, dict):
                continue
            for change in entry.get("changes", []) or []:
                if not isinstance(change, dict):
                    continue
                value = change.get("value") or {}
                contacts = value.get("contacts") or []
                contact_name_by_wa_id = {}
                for contact in contacts:
                    if not isinstance(contact, dict):
                        continue
                    wa_id = contact.get("wa_id")
                    profile_name = ((contact.get("profile") or {}).get("name")) or None
                    if wa_id:
                        contact_name_by_wa_id[str(wa_id)] = profile_name

                for message in value.get("messages", []) or []:
                    if not isinstance(message, dict):
                        continue
                    event = self._message_to_event(message, contact_name_by_wa_id)
                    if event is not None:
                        events.append(event)
        return events

    def _message_to_event(
        self,
        message: Dict[str, Any],
        contact_name_by_wa_id: Dict[str, Optional[str]],
    ) -> Optional[InboundWhatsAppEvent]:
        message_type = str(message.get("type") or "")
        from_number = str(message.get("from") or "")
        message_id = str(message.get("id") or "")

        if not (message_type and from_number and message_id):
            return None

        timestamp = self._parse_timestamp(message.get("timestamp"))
        profile_name = contact_name_by_wa_id.get(from_number)

        if message_type == "text":
            return InboundWhatsAppEvent(
                event_type="text",
                message_type=message_type,
                message_id=message_id,
                from_number=from_number,
                profile_name=profile_name,
                timestamp=timestamp,
                text=((message.get("text") or {}).get("body")) or "",
                raw_message=message,
            )

        if message_type == "document":
            document = message.get("document") or {}
            return InboundWhatsAppEvent(
                event_type="document",
                message_type=message_type,
                message_id=message_id,
                from_number=from_number,
                profile_name=profile_name,
                timestamp=timestamp,
                text=document.get("caption"),
                media_id=document.get("id"),
                mime_type=document.get("mime_type"),
                file_name=document.get("filename"),
                raw_message=message,
            )

        if message_type == "image":
            image = message.get("image") or {}
            return InboundWhatsAppEvent(
                event_type="image",
                message_type=message_type,
                message_id=message_id,
                from_number=from_number,
                profile_name=profile_name,
                timestamp=timestamp,
                text=image.get("caption"),
                media_id=image.get("id"),
                mime_type=image.get("mime_type"),
                file_name="whatsapp-image-{0}.jpg".format(message_id),
                raw_message=message,
            )

        if message_type == "interactive":
            interactive = message.get("interactive") or {}
            button_reply = interactive.get("button_reply") or {}
            if button_reply.get("id"):
                return InboundWhatsAppEvent(
                    event_type="button",
                    message_type=message_type,
                    message_id=message_id,
                    from_number=from_number,
                    profile_name=profile_name,
                    timestamp=timestamp,
                    text=button_reply.get("title"),
                    button_id=button_reply.get("id"),
                    raw_message=message,
                )

        if message_type == "button":
            button = message.get("button") or {}
            if button.get("payload"):
                return InboundWhatsAppEvent(
                    event_type="button",
                    message_type=message_type,
                    message_id=message_id,
                    from_number=from_number,
                    profile_name=profile_name,
                    timestamp=timestamp,
                    text=button.get("text"),
                    button_id=button.get("payload"),
                    raw_message=message,
                )

        return None

    def _parse_timestamp(self, value) -> datetime:
        try:
            return datetime.fromtimestamp(int(value), tz=timezone.utc)
        except Exception:
            return datetime.now(timezone.utc)
