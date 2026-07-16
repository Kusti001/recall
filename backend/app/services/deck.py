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
