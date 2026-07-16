from fastapi import APIRouter

from .endpoints.auth import router as auth_router
from .endpoints.cards import router as cards_router
from .endpoints.decks import router as decks_router

router = APIRouter(prefix="/v1")

router.include_router(auth_router)
router.include_router(cards_router)
router.include_router(decks_router)
