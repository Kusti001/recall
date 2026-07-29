from app.core.dependencies import get_current_user
from app.core.exceptions import (
    InvalidOperationError,
    NotFoundError,
    PermissionDeniedError,
)
from app.db.session import get_async_session
from app.models import User
from app.schemas import CardReviewSchema, DecksResponse, ReviewCardsResponse
from app.services import ReviewService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/review", tags=["v1 / review"])


@router.get("/cards", response_model=ReviewCardsResponse)
async def get_review_cards(
    deck_id: int | None = None,
    limit: int = 10,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = ReviewService(session)
    try:
        data = await service.get_review_cards(
            user_id=user.id,
            deck_id=deck_id,
            limit=limit,
        )
        return data
    except NotFoundError as e:
        raise HTTPException(404, str(e))
    except PermissionDeniedError as e:
        raise HTTPException(404, str(e))


@router.get("/decks", response_model=DecksResponse)
async def get_review_decks(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = ReviewService(session)
    data = await service.get_review_decks(user_id=user.id)
    return data


@router.post("/cards/{card_id}", status_code=204)
async def review_card(
    card_id: int,
    data: CardReviewSchema,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = ReviewService(session)
    try:
        await service.review_card(
            user_id=user.id,
            card_id=card_id,
            rating=data.rating,
        )
        await session.commit()
    except NotFoundError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionDeniedError as e:
        await session.rollback()
        raise HTTPException(status_code=403, detail=str(e))
    except InvalidOperationError as e:
        await session.rollback()
        raise HTTPException(status_code=400, detail=str(e))
