from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    InvalidOperationError,
    NotFoundError,
    PermissionDeniedError,
)
from app.repositories import CardRepository, ReviewRepository
from app.repositories.deck import DeckRepository
from app.schemas import CardReviewList, DecksResponse, DeckStats, ReviewCardsResponse


class ReviewService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.cards = CardRepository(session)
        self.reviews = ReviewRepository(session)
        self.decks = DeckRepository(session)

    async def get_review_cards(
        self,
        user_id: UUID,
        deck_id: int | None,
        limit: int,
    ) -> ReviewCardsResponse:

        if deck_id is not None:
            deck = await self.decks.get_by_id(deck_id)

            if not deck:
                raise NotFoundError("Deck not found")
            if deck.user_id != user_id:
                raise PermissionDeniedError("Acess denied")

        cards = await self.cards.get_review_cards(
            user_id=user_id,
            deck_id=deck_id,
            limit=limit,
        )

        return ReviewCardsResponse(
            cards=[CardReviewList.model_validate(card) for card in cards],
            total_cards=len(cards),
        )

    async def review_card(
        self,
        user_id: UUID,
        card_id: int,
        rating: int,
    ):

        card = await self.cards.get_by_id(card_id)

        if not card:
            raise NotFoundError("Card not found")

        if card.user_id != user_id:
            raise PermissionDeniedError("Access denied")

        if not 0 <= rating <= 5:
            raise InvalidOperationError("Rating must be between 0 and 5")

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
            1.3,
        )

        card.next_review = datetime.now(UTC) + timedelta(days=card.interval)

        await self.reviews.create(
            user_id=user_id,
            card_id=card_id,
            rating=rating,
        )

    async def get_review_decks(
        self,
        user_id: UUID,
    ) -> DecksResponse:

        rows = await self.decks.get_review_decks(user_id)

        decks = [DeckStats.model_validate(row) for row in rows]

        return DecksResponse(
            decks=decks,
            total_decks=len(decks),
            total_due=sum(deck.due_cards for deck in decks),
        )
