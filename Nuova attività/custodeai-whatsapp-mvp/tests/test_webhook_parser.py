from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.whatsapp.webhook_parser import WhatsAppWebhookParser


def test_parse_text_message_payload():
    payload = {
        "entry": [
            {
                "changes": [
                    {
                        "value": {
                            "contacts": [{"wa_id": "393331234567", "profile": {"name": "Mario"}}],
                            "messages": [
                                {
                                    "from": "393331234567",
                                    "id": "wamid-text-1",
                                    "timestamp": "1710000000",
                                    "type": "text",
                                    "text": {"body": "ciao"},
                                }
                            ],
                        }
                    }
                ]
            }
        ]
    }

    events = WhatsAppWebhookParser().parse(payload)

    assert len(events) == 1
    assert events[0].event_type == "text"
    assert events[0].text == "ciao"
    assert events[0].from_number == "393331234567"


def test_parse_image_message_payload():
    payload = {
        "entry": [
            {
                "changes": [
                    {
                        "value": {
                            "contacts": [{"wa_id": "393331234567", "profile": {"name": "Mario"}}],
                            "messages": [
                                {
                                    "from": "393331234567",
                                    "id": "wamid-image-1",
                                    "timestamp": "1710000000",
                                    "type": "image",
                                    "image": {
                                        "id": "media-image-1",
                                        "mime_type": "image/jpeg",
                                        "caption": "scontrino supermercato",
                                    },
                                }
                            ],
                        }
                    }
                ]
            }
        ]
    }

    events = WhatsAppWebhookParser().parse(payload)

    assert len(events) == 1
    assert events[0].event_type == "image"
    assert events[0].media_id == "media-image-1"
    assert events[0].mime_type == "image/jpeg"
    assert events[0].text == "scontrino supermercato"
