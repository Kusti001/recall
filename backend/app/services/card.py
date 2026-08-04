from this import d
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, PermissionDeniedError
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
            front_description=data.front_description,
            back=data.back,
            back_description=data.back_description,
        )
        return card

    async def update_card(self, user_id: uuid.UUID, card_id: int, data: CardUpdate):
        card = await self.cards.get_by_id(card_id)
        if not card or card.user_id != user_id:
            raise NotFoundError("Card not found")
        if card.user_id != user_id:
            raise PermissionDeniedError("Access denied")

        if data.deck_id is not None:
            card.deck_id = data.deck_id
        if data.front_description is not None:
            card.front_description = data.front_description
        if data.back_description is not None:
            card.back_description = data.back_description
        if data.front is not None:
            card.front = data.front
        if data.back is not None:
            card.back = data.back
        return card

    async def delete_card(self, user_id: uuid.UUID, card_id: int):
        card = await self.cards.get_by_id(card_id)
        if not card or card.user_id != user_id:
            raise NotFoundError("Card not found")
        if card.user_id != user_id:
            raise PermissionDeniedError("Access denied")
        await self.cards.delete(card)

    async def get_card(self, user_id: uuid.UUID, card_id: int):
        card = await self.cards.get_by_id(card_id)
        if not card or card.user_id != user_id:
            raise NotFoundError("Card not found")
        if card.user_id != user_id:
            raise PermissionDeniedError("Access denied")
        return card
