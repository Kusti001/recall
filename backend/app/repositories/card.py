from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Card


class CardRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        user_id: UUID,
        deck_id: int | None,
        front: str,
        back: str,
    ) -> Card:
        card = Card(user_id=user_id, deck_id=deck_id, front=front, back=back)
        self.session.add(card)
        await self.session.flush()
        return card
