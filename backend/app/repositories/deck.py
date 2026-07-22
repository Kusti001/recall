from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Deck
from sqlalchemy import select
from sqlalchemy.orm import selectinload

class DeckRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_id: UUID, title: str) -> Deck:
        card = Deck(user_id=user_id, title=title)
        self.session.add(card)
        await self.session.flush()
        return card

    async def get_by_id(self, deck_id: int) -> Deck | None:
        return await self.session.get(Deck, deck_id)

    async def get_by_user_id(self, user_id: UUID):
        result = await self.session.execute(
            select(Deck).where(Deck.user_id == user_id)
        )
        return result.scalars().all()

    async def delete(self, deck: Deck):
        await self.session.delete(deck)

    async def get_by_id_with_card(self, deck_id: int) -> Deck | None:
        result = await self.session.execute(
            select(Deck).where(Deck.id == deck_id).options(selectinload(Deck.cards))
        )
        return result.scalars().first()
