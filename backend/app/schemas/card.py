from datetime import datetime

from pydantic import BaseModel

from app.models.card import Status


class CardCreate(BaseModel):
    deck_id: int | None = None
    front: str
    front_description: str | None = None
    back: str
    back_description: str | None = None


class CardRead(BaseModel):
    id: int
    front: str
    status: Status
    front_description: str | None = None
    back: str
    back_description: str | None = None
    next_review: datetime
    interval: int
    ease_factor: float
    success_streak: int
    total_reviews: int

    model_config = {"from_attributes": True}


class CardUpdate(BaseModel):
    front: str | None = None
    back: str | None = None
    front_description: str | None = None
    back_description: str | None = None
    deck_id: int | None = None


class CardListItem(BaseModel):
    id: int
    front: str
    front_description: str | None = None
    back: str
    back_description: str | None = None
    next_review: datetime
    status: Status
    success_streak: int
    total_reviews: int

    model_config = {"from_attributes": True}


class DeckCardsResponse(BaseModel):
    cards: list[CardListItem]
    total_cards: int


class CardReviewList(BaseModel):
    id: int
    front: str
    front_description: str | None = None
    back: str
    back_description: str | None = None

    model_config = {"from_attributes": True}


class ReviewCardsResponse(BaseModel):
    cards: list[CardReviewList]
    total_cards: int
