from app.core.dependencies import get_current_user
from app.db.session import get_async_session
from app.models import User
from app.schemas import ProfileStats
from app.services import ProfileService
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/profile", tags=["v1 / profile"])


@router.get("/stats", response_model=ProfileStats)
async def get_profile_stats(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = ProfileService(session)
    data = await service.get_profile_stats(user=user)
    await session.commit()
    return data
