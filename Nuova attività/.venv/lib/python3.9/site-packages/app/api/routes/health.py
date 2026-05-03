from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/health")
def healthcheck(request: Request):
    settings = request.app.state.settings
    return {
        "status": "ok",
        "app": settings.app_name,
        "environment": settings.app_env,
    }

