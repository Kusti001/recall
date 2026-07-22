from app.core.dependencies import get_current_user
from app.db.session import get_async_session
from app.models import User
from app.schemas import CardCreate, CardRead, CardUpdate
from app.services.card import CardService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/cards", tags=["v1 / cards"])


@router.post("/", response_model=CardRead)
async def create_card(
    data: CardCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = CardService(session)
    card = await service.create_card(user_id=user.id, data=data)
    await session.commit()
    return CardRead.model_validate(card)

@router.patch("/{card_id}", response_model=CardRead)
async def update_card(
    card_id: int,
    data: CardUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = CardService(session)
    try:
        card = await service.update_card(user_id=user.id, data=data, card_id=card_id)
        await session.commit()
        return CardRead.model_validate(card)
    except ValueError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{card_id}", status_code=204)
async def delete_card(
    card_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = CardService(session)
    try:
        await service.delete_card(user_id=user.id, card_id=card_id)
        await session.commit()
    except ValueError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{card_id}", response_model=CardRead)
async def get_card(
    card_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = CardService(session)
    try:
        card = await service.get_card(user_id=user.id, card_id=card_id)
        await session.commit()
        return CardRead.model_validate(card)
    except ValueError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))
