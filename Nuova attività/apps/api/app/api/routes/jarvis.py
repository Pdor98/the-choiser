from typing import Optional

from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_jarvis_cloud_service
from app.schemas.jarvis import JarvisResponseProxyRequest

router = APIRouter(prefix="/jarvis")


def _status_for_openai_error(exc: Exception) -> Optional[int]:
    module = exc.__class__.__module__
    if not module.startswith("openai"):
        return None

    name = exc.__class__.__name__
    if name == "AuthenticationError":
        return 401
    if name == "RateLimitError":
        return 429
    if name == "BadRequestError":
        return 400
    return 502


@router.post("/responses")
def create_jarvis_response(
    payload: JarvisResponseProxyRequest,
    jarvis_cloud_service=Depends(get_jarvis_cloud_service),
):
    try:
        return jarvis_cloud_service.create_response(payload)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        status_code = _status_for_openai_error(exc)
        if status_code is None:
            raise
        raise HTTPException(status_code=status_code, detail=str(exc))
