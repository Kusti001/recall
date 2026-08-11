from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, PermissionDeniedError
from app.repositories import DeckRepository
from app.schemas import (
    CardListItem,
    DeckCardsResponse,
    DeckCreate,
    DecksResponse,
    DeckStats,
)


class DeckService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.decks = DeckRepository(session)

    async def create_deck(self, user_id: UUID, data: DeckCreate):
        card = await self.decks.create(user_id=user_id, title=data.title)
        return card

    async def get_deck_stats(self, user_id: UUID, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)
        if not deck or deck.user_id != user_id:
            raise NotFoundError("Deck not found")
        if deck.user_id != user_id:
            raise PermissionDeniedError("Access denied")

        deck = await self.decks.get_deck_stats(deck_id)
        return deck

    async def get_decks(self, user_id: UUID):

        rows = await self.decks.get_decks(user_id)

        decks = [DeckStats.model_validate(row) for row in rows]

        return DecksResponse(
            decks=decks,
            total_due=sum(deck.due_cards for deck in decks),
            total_decks=len(decks),
        )

    async def delete_deck(self, user_id: UUID, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)

        if not deck or deck.user_id != user_id:
            raise NotFoundError("Deck not found")
        if deck.user_id != user_id:
            raise PermissionDeniedError("Access denied")

        await self.decks.delete(deck)

    async def update_deck(self, user_id: UUID, data: DeckCreate, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)
        if not deck or deck.user_id != user_id:
            raise NotFoundError("Deck not found")
        if deck.user_id != user_id:
            raise PermissionDeniedError("Access denied")
        deck.title = data.title
        return deck

    async def get_cards_by_deck(self, user_id: UUID, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)

        if not deck:
            raise NotFoundError("Deck not found")

        if deck.user_id != user_id:
            raise PermissionDeniedError("Access denied")

        cards = await self.decks.get_cards_by_deck(deck_id)

        return DeckCardsResponse(
            cards=[CardListItem.model_validate(card) for card in cards],
            total_cards=len(cards),
        )
