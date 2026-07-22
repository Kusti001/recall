from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

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

    async def get_by_id(self, card_id: int) -> Card | None:
        return await self.session.get(Card, card_id)

    async def delete(self, card: Card):
        await self.session.delete(card)

    async def get_due_cards(self, user_id: UUID, deck_id: int | None, limit: int):
        query = (
                select(Card)
                .where(Card.user_id == user_id)
                .where(Card.next_review <= func.now())
                .order_by(Card.next_review)
                .limit(limit)
            )
        if deck_id is not None:
            query = query.where(Card.deck_id == deck_id)

        result = await self.session.execute(query)
        return result.scalars().all()
