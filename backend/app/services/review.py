import uuid
from datetime import timedelta

from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories import CardRepository


class ReviewService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.cards = CardRepository(session)

    async def get_due_cards(self, user_id: uuid.UUID, deck_id: int|None , limit: int):
        cards = await self.cards.get_due_cards(
            user_id=user_id,
            deck_id=deck_id,
            limit=limit
        )
        return cards

    async def review_card(self, user_id: uuid.UUID, card_id: int, rating: int):
        card = await self.cards.get_by_id(card_id)
        if not card or card.user_id != user_id:
            raise ValueError("Card not found or access denied")
        if rating < 0 or rating > 5:
            raise ValueError("Rating must be between 0 and 5")

        #SRS algorithm
        if rating >= 3:
                if card.reviews_count == 0:
                    card.interval = 1
                elif card.reviews_count == 1:
                    card.interval = 6
                else:
                    card.interval = round(card.interval * card.ease_factor)
                card.reviews_count += 1
        else:
            card.interval = 1
            card.reviews_count = 0

        card.ease_factor = max(
            card.ease_factor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)),
            1.3
        )
        card.next_review = func.now() + timedelta(days=card.interval)

        return card
