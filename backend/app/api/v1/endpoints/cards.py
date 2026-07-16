from app.core.dependencies import get_current_user
from app.db.session import get_async_session
from app.models import User
from app.schemas import CardCreate, CardRead
from app.services.card import CardService
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/cards", tags=["v1 / cards"])


@router.post("/")
async def create_card(
    data: CardCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = CardService(session)

    try:
        card = await service.create_card(user_id=user.id, data=data)
        await session.commit()
        return card
    except PermissionError:
        await session.rollback()
        raise HTTPException(status_code=403, detail="Forbidden")
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=400, detail=str(e))
