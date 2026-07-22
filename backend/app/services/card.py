import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories import CardRepository
from app.schemas import CardCreate, CardUpdate


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

    async def update_card(self, user_id: uuid.UUID, card_id: int, data: CardUpdate):
        card = await self.cards.get_by_id(card_id)
        if not card or card.user_id != user_id:
            raise ValueError("Card not found or access denied")
        if data.deck_id is not None:
            card.deck_id = data.deck_id
        if data.front is not None:
            card.front = data.front
        if data.back is not None:
            card.back = data.back
        return card

    async def delete_card(self, user_id: uuid.UUID, card_id: int):
        card = await self.cards.get_by_id(card_id)
        if not card or card.user_id != user_id:
            raise ValueError("Card not found or access denied")
        await self.cards.delete(card)

    async def get_card(self, user_id: uuid.UUID, card_id: int):
        card = await self.cards.get_by_id(card_id)
        if not card or card.user_id != user_id:
            raise ValueError("Card not found or access denied")
        return card
