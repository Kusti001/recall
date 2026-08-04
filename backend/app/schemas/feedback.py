from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class FeedbackCreate(BaseModel):
    message: str


class FeedbackRead(BaseModel):
    user_id: UUID | None = None
    message: str
    created_at: datetime
