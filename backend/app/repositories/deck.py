from uuid import UUID

from sqlalchemy import case, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.expression import func

from app.models import Card, Deck


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

    async def get_decks(self, user_id: UUID):
        stmt = (
            select(
                Deck.id,
                Deck.title,
                func.count(Card.id).label("total_cards"),
                func.count(case((Card.interval >= 21, 1))).label("mastered_cards"),
                func.count(case((Card.next_review <= func.now(), 1))).label(
                    "due_cards"
                ),
            )
            .join(Card, Card.deck_id == Deck.id, isouter=True)
            .where(Deck.user_id == user_id)
            .group_by(Deck.id)
        )

        result = await self.session.execute(stmt)

        return result.mappings().all()

    async def delete(self, deck: Deck):
        await self.session.delete(deck)

    async def get_deck_stats(self, deck_id: int):
        stmt = (
            select(
                Deck.id,
                Deck.title,
                func.count(Card.id).label("total_cards"),
                func.count(case((Card.interval >= 21, 1))).label("mastered_cards"),
                func.count(case((Card.next_review <= func.now(), 1))).label(
                    "due_cards"
                ),
            )
            .join(Card, Card.deck_id == Deck.id, isouter=True)
            .where(Deck.id == deck_id)
            .group_by(Deck.id)
        )

        result = await self.session.execute(stmt)

        return result.mappings().first()

    async def get_cards_by_deck(self, deck_id: int):
        stmt = select(Card).where(Card.deck_id == deck_id)

        result = await self.session.execute(stmt)

        return result.scalars().all()

    async def get_review_decks(self, user_id: UUID):
        stmt = (
            select(
                Deck.id,
                Deck.title,
                func.count(Card.id).label("total_cards"),
                func.count(case((Card.interval >= 21, 1))).label("mastered_cards"),
                func.count(case((Card.next_review <= func.now(), 1))).label("due_cards"),
            )
            .join(Card, Card.deck_id == Deck.id)
            .where(Deck.user_id == user_id)
            .group_by(Deck.id)
            .having(func.count(case((Card.next_review <= func.now(), 1))) > 0)
        )

        result = await self.session.execute(stmt)

        return result.mappings().all()
