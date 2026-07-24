from uuid import UUID

from sqlalchemy import case, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.sql.expression import func
from app.models import Card, Deck
from app.schemas import DeckStats

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
        stmt = (
            select(
                Deck.id,
                Deck.title,
                func.count(Card.id).label("total"),
                func.count(case((Card.interval >= 21, 1))).label("mastered"),
                func.count(case((Card.next_review <= func.now(), 1))).label("due"),
            )
            .join(Card, Card.deck_id == Deck.id, isouter=True)
            .where(Deck.user_id == user_id)
            .group_by(Deck.id)
        )
        result = await self.session.execute(stmt)
        return [
            DeckStats.model_validate(row._mapping)
            for row in result
        ]

    async def delete(self, deck: Deck):
        await self.session.delete(deck)

    async def get_by_id_with_card(self, deck_id: int) -> Deck | None:
        result = await self.session.execute(
            select(Deck).where(Deck.id == deck_id).options(selectinload(Deck.cards))
        )
        return result.scalars().first()
