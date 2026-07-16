import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories import CardRepository
from app.schemas import CardCreate


class CardService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.cards = CardRepository(session)

    async def create_card(self, user_id: uuid.UUID, data: CardCreate):
        card = await self.cards.create(
            user_id=user_id,
            deck_id=data.deck_id,
            front=data.front,
            back=data.back,
        )
        return card
