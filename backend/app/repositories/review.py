from datetime import UTC, date, datetime, timedelta
from typing import cast
from uuid import UUID

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Review


class ReviewRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_id: UUID, card_id: int, rating: int) -> Review:
        review = Review(user_id=user_id, card_id=card_id, rating=rating)
        self.session.add(review)
        await self.session.flush()
        return review

    async def get_current_streak(self, user_id: UUID) -> list[date]:
        stmt = (
            select(func.date(Review.reviewed_at).label("review_day"))
            .where(Review.user_id == user_id)
            .distinct()
            .order_by(func.date(Review.reviewed_at).desc())
        )

        result = await self.session.execute(stmt)
        return cast(list[date], result.scalars().all())

    async def get_review_heatmap(self, user_id: UUID):
        stmt = (
            select(
                func.date(Review.reviewed_at).label("date"),
                func.count(Review.id).label("count"),
            )
            .where(Review.user_id == user_id)
            .group_by(func.date(Review.reviewed_at))
            .order_by(func.date(Review.reviewed_at))
        )

        result = await self.session.execute(stmt)

        return result.all()

    async def get_retention_30d(self, user_id: UUID):
        cutoff = datetime.now(UTC) - timedelta(days=30)

        stmt = select(
            func.count(Review.id).label("total"),
            func.count(case((Review.rating >= 3, 1))).label("successful"),
        ).where(
            Review.user_id == user_id,
            Review.reviewed_at >= cutoff,
        )

        result = await self.session.execute(stmt)
        return result.one()
