def test_telegram_webhook_calls_handler(client, monkeypatch):
    calls = {}

    def fake_handle_payload(payload):
        calls["payload"] = payload
        return "processed"

    monkeypatch.setattr(client.app.state.telegram_handler, "handle_payload", fake_handle_payload)

    payload = {
        "update_id": 1,
        "message": {
            "message_id": 10,
            "from": {
                "id": 123,
                "is_bot": False,
                "first_name": "Mario",
                "username": "mario",
            },
            "chat": {"id": 123, "type": "private"},
            "text": "/start",
        },
    }

    response = client.post("/api/v1/telegram/webhook", json=payload)

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "detail": "processed"}
    assert calls["payload"]["update_id"] == 1
