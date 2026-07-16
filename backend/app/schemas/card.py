from uuid import UUID

from pydantic import BaseModel


class CardCreate(BaseModel):
    deck_id: int | None = None
    front: str
    back: str


class CardRead(BaseModel):
    id: int
    user_id: UUID
    deck_id: int | None
    front: str
    back: str

    model_config = {"from_attributes": True}
