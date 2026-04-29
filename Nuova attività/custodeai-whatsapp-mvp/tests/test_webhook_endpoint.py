from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.models import Document, ProcessedMessage, Reminder


def build_text_payload(message_id="wamid-text-1", body="ciao"):
    return {
        "entry": [
            {
                "changes": [
                    {
                        "value": {
                            "contacts": [{"wa_id": "393331234567", "profile": {"name": "Mario"}}],
                            "messages": [
                                {
                                    "from": "393331234567",
                                    "id": message_id,
                                    "timestamp": "1777500000",
                                    "type": "text",
                                    "text": {"body": body},
                                }
                            ],
                        }
                    }
                ]
            }
        ]
    }


def test_whatsapp_webhook_verification_success(client):
    response = client.get(
        "/webhooks/whatsapp",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "verify-token",
            "hub.challenge": "abc123",
        },
    )

    assert response.status_code == 200
    assert response.text == "abc123"


def test_whatsapp_webhook_verification_failure(client):
    response = client.get(
        "/webhooks/whatsapp",
        params={
            "hub.mode": "subscribe",
            "hub.verify_token": "wrong-token",
            "hub.challenge": "abc123",
        },
    )

    assert response.status_code == 403


def test_webhook_endpoint_returns_200_and_calls_processor(client, monkeypatch):
    calls = {}

    def fake_process(payload):
        calls["payload"] = payload
        return ["processed"]

    monkeypatch.setattr(client.app.state.processor, "process_webhook_payload", fake_process)

    payload = {"entry": []}
    response = client.post("/webhooks/whatsapp", json=payload)

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    assert calls["payload"] == payload


def test_duplicate_message_is_ignored(client, monkeypatch):
    sent_messages = []

    def fake_send_text_message(to, body, preview_url=False):
        sent_messages.append((to, body))
        return {"messages": [{"id": "out-1"}]}

    monkeypatch.setattr(client.app.state.whatsapp_client, "send_text_message", fake_send_text_message)

    payload = build_text_payload(
        message_id="wamid-duplicate-1",
        body="Ricordami la bolletta Enel da 82,30 euro che scade il 15 maggio 2026",
    )

    first = client.app.state.processor.process_webhook_payload(payload)
    second = client.app.state.processor.process_webhook_payload(payload)

    assert first == ["text_processed"]
    assert second == ["duplicate_ignored"]
    assert len(sent_messages) == 1

    with client.app.state.session_factory() as session:
        assert session.query(Document).count() == 1
        assert session.query(ProcessedMessage).count() == 1
        assert session.query(Reminder).count() == 1


def test_text_message_processing_without_openai_key(client, monkeypatch):
    sent_messages = []

    def fake_send_text_message(to, body, preview_url=False):
        sent_messages.append((to, body))
        return {"messages": [{"id": "out-2"}]}

    monkeypatch.setattr(client.app.state.whatsapp_client, "send_text_message", fake_send_text_message)

    payload = build_text_payload(
        message_id="wamid-text-fallback-1",
        body="Ricordami la bolletta Enel da 82,30 euro che scade il 15 maggio 2026",
    )

    response = client.post("/webhooks/whatsapp", json=payload)

    assert response.status_code == 200
    with client.app.state.session_factory() as session:
        document = session.query(Document).filter(Document.whatsapp_message_id == "wamid-text-fallback-1").one()
        assert document.tipo_documento == "bolletta"
        assert document.fornitore == "Enel"
        assert float(document.importo) == 82.30
        assert document.data_scadenza.isoformat() == "2026-05-15"
        assert document.reminder_status in ("scheduled", "sent")

    assert any("CustodeAI ha salvato il documento." in body for _, body in sent_messages)


def test_env_does_not_exist_or_is_gitignored():
    project_root = PROJECT_ROOT
    env_file = project_root / ".env"
    gitignore = (project_root / ".gitignore").read_text(encoding="utf-8")

    assert ".env" in gitignore
    assert (not env_file.exists()) or ".env" in gitignore
