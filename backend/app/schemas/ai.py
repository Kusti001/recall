from pydantic import BaseModel, Field


class GenerateDeckRequest(BaseModel):
    prompt: str = Field(min_length=10, max_length=1000)
    card_count: int = Field(default=10, ge=1, le=20)


class GeneratedCard(BaseModel):
    front: str
    front_description: str | None = None
    back: str
    back_description: str | None = None


class GeneratedDeck(BaseModel):
    title: str
    cards: list[GeneratedCard]
