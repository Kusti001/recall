from app.core.dependencies import get_current_superuser, get_current_user_optional
from app.db.session import get_async_session
from app.models import Feedback, User
from app.schemas import AdminCardsStats, AdminUserStats, FeedbackCreate, FeedbackRead
from app.services import AdminService
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="", tags=["v1 / admin"])


@router.post("/feedback", status_code=201)
async def submit_feedback(
    data: FeedbackCreate,
    user: User | None = Depends(get_current_user_optional),
    session: AsyncSession = Depends(get_async_session),
):
    feedback = Feedback(user_id=user.id if user else None, message=data.message)
    session.add(feedback)
    await session.commit()
    return {"status": "ok"}


@router.get("/admin/feedback", response_model=list[FeedbackRead])
async def list_feedback(
    admin: User = Depends(get_current_superuser),
    session: AsyncSession = Depends(get_async_session),
):
    stmt = select(Feedback).order_by(Feedback.created_at.desc())
    result = await session.execute(stmt)
    return result.scalars().all()


@router.get("/admin/stats/users", response_model=AdminUserStats)
async def users_stats(
    admin: User = Depends(get_current_superuser),
    session: AsyncSession = Depends(get_async_session),
):
    service = AdminService(session)
    return await service.get_user_stats()


@router.get("/admin/stats/cards", response_model=AdminCardsStats)
async def cards_stats(
    admin: User = Depends(get_current_superuser),
    session: AsyncSession = Depends(get_async_session),
):
    service = AdminService(session)
    return await service.get_cards_stats()
