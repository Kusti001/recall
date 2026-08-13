from pydantic import BaseModel


class ExportCard(BaseModel):
    front: str
    front_description: str | None
    back: str
    back_description: str | None


class ExportDeckData(BaseModel):
    title: str
    cards: list[ExportCard]


class ExportDeckResponse(BaseModel):
    type: str = "recall"
    version: int = 1
    deck: ExportDeckData
