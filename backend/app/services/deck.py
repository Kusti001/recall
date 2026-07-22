import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories import DeckRepository
from app.schemas import DeckCreate


class DeckService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.decks = DeckRepository(session)

    async def create_deck(self, user_id: uuid.UUID, data: DeckCreate):
        card = await self.decks.create(user_id=user_id, title=data.title)
        return card

    async def get_deck(self, user_id: uuid.UUID, deck_id: int):
        deck = await self.decks.get_by_id_with_card(deck_id)
        if not deck or deck.user_id != user_id:
            raise ValueError("Deck not found or access denied")
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
