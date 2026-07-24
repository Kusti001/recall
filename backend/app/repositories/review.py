from uuid import UUID

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
