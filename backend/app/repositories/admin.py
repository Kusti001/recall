from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Card, Review, User, Deck


class AdminRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def count_users(self) -> int:
        result = await self.session.execute(select(func.count(User.id)))

        return result.scalar_one()

    async def count_active_users(
        self,
        since: datetime,
    ) -> int:
        result = await self.session.execute(
            select(func.count(func.distinct(Review.user_id))).where(
                Review.reviewed_at >= since
            )
        )

        return result.scalar_one()

    async def count_new_users(
        self,
        since: datetime,
    ) -> int:
        result = await self.session.execute(
            select(func.count(User.id)).where(User.created_at >= since)
        )

        return result.scalar_one()

    async def count_cards(self) -> int:
        result = await self.session.execute(select(func.count(Card.id)))

        return result.scalar_one()

    async def count_created_cards(
        self,
        since: datetime,
    ) -> int:
        result = await self.session.execute(
            select(func.count(Card.id)).where(Card.created_at >= since)
        )

        return result.scalar_one()

    async def count_reviews(
        self,
        since: datetime,
    ) -> int:
        result = await self.session.execute(
            select(func.count(Review.id)).where(Review.reviewed_at >= since)
        )

        return result.scalar_one()

    async def count_decks(self) -> int:
        result = await self.session.execute(select(func.count(Deck.id)))

        return result.scalar_one()
