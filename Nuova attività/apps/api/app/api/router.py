from fastapi import APIRouter

from app.api.routes import documents, health, jarvis, telegram

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(documents.router, tags=["documents"])
api_router.include_router(jarvis.router, tags=["jarvis"])
api_router.include_router(telegram.router, tags=["telegram"])
