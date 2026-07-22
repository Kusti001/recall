from gettext import Catalog
from this import d

from app.core.dependencies import get_current_user
from app.db.session import get_async_session
from app.models import User
from app.schemas import DeckCreate,DeckRead
from app.services import DeckService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/decks", tags=["v1 / decks"])

@router.get("/{deck_id}")
async def get_deck(
    deck_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    deck = await service.get_deck(user_id=user.id, deck_id=deck_id)
    return deck

@router.get("/")
async def get_decks(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    decks = await service.get_decks(user_id=user.id)
    return {
        "decks": decks,
        "total": len(decks)
    }


@router.post("/", response_model=DeckRead)
async def create_deck(
    data: DeckCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    deck = await service.create_deck(user_id=user.id, data=data)
    await session.commit()
    return DeckRead.model_validate(deck)

@router.delete("/{deck_id}", status_code=204)
async def delete_deck(
    deck_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    try:
        await service.delete_deck(user_id=user.id, deck_id=deck_id)
        await session.commit()
    except ValueError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/{deck_id}", response_model=DeckRead)
async def update_deck(
    deck_id: int,
    data: DeckCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    try:
        deck = await service.update_deck(user_id=user.id, data=data, deck_id=deck_id)
        await session.commit()
        return DeckRead.model_validate(deck)
    except ValueError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))
