from types import SimpleNamespace

from app.services.jarvis_cloud import JarvisCloudService


def test_jarvis_responses_route_calls_service(client, monkeypatch):
    calls = {}

    class DummyService:
        def create_response(self, payload):
            return {}

    client.app.state.jarvis_cloud_service = DummyService()

    def fake_create_response(payload):
        calls["payload"] = payload
        return {"output_text": "ciao", "output": []}

    monkeypatch.setattr(client.app.state.jarvis_cloud_service, "create_response", fake_create_response)

    response = client.post(
        "/api/v1/jarvis/responses",
        json={
            "model": "gpt-4.1-mini",
            "instructions": "Parla in italiano",
            "input": [{"role": "user", "content": "ciao"}],
            "tools": [],
            "parallel_tool_calls": False,
            "store": False,
        },
    )

    assert response.status_code == 200
    assert response.json()["output_text"] == "ciao"
    assert calls["payload"].model == "gpt-4.1-mini"
    assert calls["payload"].instructions == "Parla in italiano"


def test_jarvis_responses_route_returns_503_when_backend_key_is_missing(client, monkeypatch):
    class DummyService:
        def create_response(self, payload):
            return {}

    client.app.state.jarvis_cloud_service = DummyService()

    def fake_create_response(payload):
        raise RuntimeError("OPENAI_API_KEY is not configured on the backend")

    monkeypatch.setattr(client.app.state.jarvis_cloud_service, "create_response", fake_create_response)

    response = client.post(
        "/api/v1/jarvis/responses",
        json={
            "instructions": "Parla in italiano",
            "input": [{"role": "user", "content": "ciao"}],
        },
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "OPENAI_API_KEY is not configured on the backend"


def test_jarvis_responses_route_returns_429_for_quota_errors(client, monkeypatch):
    class DummyService:
        def create_response(self, payload):
            return {}

    class FakeRateLimitError(Exception):
        pass

    FakeRateLimitError.__name__ = "RateLimitError"
    FakeRateLimitError.__module__ = "openai"

    client.app.state.jarvis_cloud_service = DummyService()

    def fake_create_response(payload):
        raise FakeRateLimitError("insufficient_quota")

    monkeypatch.setattr(client.app.state.jarvis_cloud_service, "create_response", fake_create_response)

    response = client.post(
        "/api/v1/jarvis/responses",
        json={
            "instructions": "Parla in italiano",
            "input": [{"role": "user", "content": "ciao"}],
        },
    )

    assert response.status_code == 429
    assert "insufficient_quota" in response.json()["detail"]


def test_jarvis_cloud_service_prefers_local_openai_compatible_server_when_configured():
    settings = SimpleNamespace(
        jarvis_base_url="http://127.0.0.1:1234",
        jarvis_api_key="",
        jarvis_model="",
        openai_api_key="test-openai-key",
        openai_model="gpt-4.1-mini",
    )

    service = JarvisCloudService(settings)

    assert service.local_base_url == "http://127.0.0.1:1234/v1"
    assert service.local_api_key == "lm-studio"


def test_jarvis_cloud_service_detects_first_local_model(monkeypatch):
    settings = SimpleNamespace(
        jarvis_base_url="http://127.0.0.1:1234/v1",
        jarvis_api_key="lm-studio",
        jarvis_model="",
        openai_api_key="",
        openai_model="gpt-4.1-mini",
    )
    service = JarvisCloudService(settings)

    def fake_list():
        return SimpleNamespace(data=[SimpleNamespace(id="qwen2.5-7b-instruct")])

    monkeypatch.setattr(service.client.models, "list", fake_list)

    assert service._resolve_model("") == "qwen2.5-7b-instruct"


def test_jarvis_cloud_service_requires_a_loaded_local_model(monkeypatch):
    settings = SimpleNamespace(
        jarvis_base_url="http://127.0.0.1:1234/v1",
        jarvis_api_key="lm-studio",
        jarvis_model="",
        openai_api_key="",
        openai_model="gpt-4.1-mini",
    )
    service = JarvisCloudService(settings)

    def fake_list():
        return SimpleNamespace(data=[])

    monkeypatch.setattr(service.client.models, "list", fake_list)

    try:
        service._resolve_model("")
    except RuntimeError as exc:
        assert "Nessun modello locale disponibile" in str(exc)
    else:
        raise AssertionError("Expected RuntimeError when no local model is loaded")
