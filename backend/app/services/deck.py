import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories import DeckRepository
from app.schemas import DeckCreate, CardListItem


class DeckService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.decks = DeckRepository(session)

    async def create_deck(self, user_id: uuid.UUID, data: DeckCreate):
        card = await self.decks.create(user_id=user_id, title=data.title)
        return card

    async def get_deck(self, user_id: uuid.UUID, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)
        if not deck or deck.user_id != user_id:
            raise ValueError("Deck not found or access denied")

        deck = await self.decks.get_by_id_with_stats(deck_id)
        return deck

    async def get_decks(self, user_id: uuid.UUID):
        decks = await self.decks.get_by_user_id(user_id)
        return decks

    async def delete_deck(self, user_id: uuid.UUID, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)
        if not deck or deck.user_id != user_id:
            raise ValueError("Deck not found or access denied")
        await self.decks.delete(deck)

    async def update_deck(self, user_id: uuid.UUID, data: DeckCreate, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)
        if not deck or deck.user_id != user_id:
            raise ValueError("Deck not found or access denied")
        deck.title = data.title
        await self.session.flush()
        return deck

    async def get_cards_by_deck(self, user_id: uuid.UUID, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)
        if not deck or deck.user_id != user_id:
            raise ValueError("Deck not found or access denied")

        cards = await self.decks.get_cards_by_deck(deck_id)
        return {
                "cards": [
                    CardListItem.from_card(card)
                    for card in cards
                ],
                "total": len(cards)
            }
