from app.core.dependencies import get_current_user
from app.db.session import get_async_session
from app.models import User
from app.schemas import DeckCreate
from app.services import DeckService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/decks", tags=["v1 / decks"])


@router.post("/")
async def create_deck(
    data: DeckCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)

    try:
        deck = await service.create_deck(user_id=user.id, data=data)
        await session.commit()
        return deck
    except PermissionError:
        await session.rollback()
        raise HTTPException(status_code=403, detail="Forbidden")
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=400, detail=str(e))
