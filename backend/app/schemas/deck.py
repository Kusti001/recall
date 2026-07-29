from uuid import UUID

from pydantic import BaseModel


class DeckCreate(BaseModel):
    title: str


class DeckRead(BaseModel):
    id: int
    user_id: UUID
    title: str

    model_config = {"from_attributes": True}


class DeckStats(BaseModel):
    id: int
    title: str
    total_cards: int
    mastered_cards: int
    due_cards: int


class DecksResponse(BaseModel):
    decks: list[DeckStats]
    total_due: int
    total_decks: int
