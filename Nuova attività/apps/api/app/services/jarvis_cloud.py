from typing import Any, Dict, Optional
from urllib.parse import urlparse, urlunparse


class JarvisCloudService:
    def __init__(self, settings):
        self.local_base_url = self._normalize_base_url(settings.jarvis_base_url)
        self.local_api_key = settings.jarvis_api_key.strip() or "lm-studio"
        self.local_model = settings.jarvis_model.strip()
        self.cloud_model = settings.openai_model
        self.detected_local_model: Optional[str] = None
        self.client = None

        from openai import OpenAI

        if self.local_base_url:
            self.client = OpenAI(
                api_key=self.local_api_key,
                base_url=self.local_base_url,
            )
        elif settings.openai_api_key:
            self.client = OpenAI(api_key=settings.openai_api_key)

    def create_response(self, payload) -> Dict[str, Any]:
        if self.client is None:
            raise RuntimeError(
                "Nessun provider AI configurato sul backend. Imposta JARVIS_BASE_URL per un modello locale oppure OPENAI_API_KEY per il cloud."
            )

        response = self.client.responses.create(
            model=self._resolve_model(payload.model),
            instructions=payload.instructions,
            input=payload.input,
            tools=payload.tools,
            parallel_tool_calls=payload.parallel_tool_calls,
            store=payload.store,
        )
        return response.model_dump(mode="json")

    def _resolve_model(self, requested_model: Optional[str]) -> str:
        trimmed = (requested_model or "").strip()
        if trimmed:
            return trimmed

        if self.local_base_url:
            if self.local_model:
                return self.local_model
            if self.detected_local_model:
                return self.detected_local_model
            self.detected_local_model = self._detect_local_model()
            return self.detected_local_model

        return self.cloud_model

    def _detect_local_model(self) -> str:
        try:
            models = self.client.models.list()
        except Exception as exc:
            if exc.__class__.__module__.startswith("openai") and exc.__class__.__name__ == "APIConnectionError":
                raise RuntimeError(
                    f"Server del modello locale non raggiungibile su {self.local_base_url}. Avvia LM Studio e attiva lo Start server."
                ) from exc
            raise

        candidates = [getattr(model, "id", "").strip() for model in getattr(models, "data", [])]
        candidates = [model_id for model_id in candidates if model_id]
        if not candidates:
            raise RuntimeError(
                "Nessun modello locale disponibile. In LM Studio carica un modello e avvia il server locale."
            )
        return candidates[0]

    def _normalize_base_url(self, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            return ""

        parsed = urlparse(trimmed)
        path = parsed.path.rstrip("/")
        if path.endswith("/v1") or path == "v1":
            return trimmed.rstrip("/")

        normalized_path = "/v1" if not path else path + "/v1"
        return urlunparse(parsed._replace(path=normalized_path)).rstrip("/")
