from app.core.dependencies import get_current_user
from app.db.session import get_async_session
from app.models import User
from app.services import ReviewService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import CardReviewSchema

router = APIRouter(prefix="", tags=["v1 / review"])


@router.get("/cards/due")
async def get_due_cards(
    deck_id: int| None = None,
    limit: int = 10,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = ReviewService(session)
    cards = await service.get_due_cards(user_id=user.id, deck_id=deck_id, limit=limit)
    return {
        "cards": cards,
        "total": len(cards)
    }

@router.post("/cards/{card_id}/review")
async def review_card(
    card_id: int,
    data: CardReviewSchema,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = ReviewService(session)
    try:
        card = await service.review_card(user_id=user.id, card_id=card_id, rating=data.rating)
        await session.commit()
        return card
    except ValueError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))
