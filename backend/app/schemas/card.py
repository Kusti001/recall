from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CardCreate(BaseModel):
    deck_id: int | None = None
    front: str
    back: str


class CardRead(BaseModel):
    id: int
    front: str
    back: str
    next_review: datetime
    interval: int
    ease_factor: float
    reviews_count: int

    model_config = {"from_attributes": True}

class CardUpdate(BaseModel):
    front: str | None = None
    back: str | None = None
    deck_id: int | None = None

class CardListItem(BaseModel):
    id: int
    front: str
    back: str
    interval: int
    status: str
    reviews: int

    #TODO: add status field RIGHT in model!!
    @classmethod
    def from_card(cls, card):
        return cls(
            id=card.id,
            front=card.front,
            back=card.back,
            interval=card.interval,
            reviews=card.reviews_count,
            #TODO: add MORE STATUSES: due, mastered, new, learning, review
            status="due" if card.next_review <= datetime.now() else ( "mastered" if card.interval >= 21 else "learning" )
        )

class CardReviewList(BaseModel):
    id: int
    front: str
    back: str
    model_config = {"from_attributes": True}
