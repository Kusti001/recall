from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class FeedbackCreate(BaseModel):
    message: str


class FeedbackRead(BaseModel):
    id: int
    user_id: UUID | None
    message: str
    created_at: datetime

class AdminUserStats(BaseModel):
    total_users: int
    active_today: int
    active_this_week: int
    new_this_week: int

class AdminCardsStats(BaseModel):
    total_cards: int
    total_decks: int
    created_today: int
    reviews_today: int
