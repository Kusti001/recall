from pydantic import BaseModel


class DeckCreate(BaseModel):
    title: str
