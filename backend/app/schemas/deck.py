from pydantic import BaseModel
from uuid import UUID

class DeckCreate(BaseModel):
    title: str


class DeckRead(BaseModel):
    id: int
    user_id: UUID
    title: str

    model_config = {"from_attributes": True}
