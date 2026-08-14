from typing import Literal

from pydantic import BaseModel, Field, field_validator

MAX_IMPORT_CARDS = 200


class ExportCard(BaseModel):
    front: str = Field(min_length=1, max_length=1000)
    front_description: str | None = Field(default=None, max_length=1000)
    back: str = Field(min_length=1, max_length=1000)
    back_description: str | None = Field(default=None, max_length=1000)

    @field_validator("front", "back", mode="before")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip()

        return value

    @field_validator("front_description", "back_description", mode="before")
    @classmethod
    def strip_optional_text(cls, value: str | None) -> str | None:
        if not isinstance(value, str):
            return value

        value = value.strip()

        return value or None


class ExportDeckData(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    cards: list[ExportCard] = Field(min_length=1, max_length=MAX_IMPORT_CARDS)

    @field_validator("title", mode="before")
    @classmethod
    def strip_title(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip()

        return value


class ExportDeckResponse(BaseModel):
    type: str = "recall"
    version: int = 1
    deck: ExportDeckData


class ImportDeckRequest(BaseModel):
    type: Literal["recall"]
    version: Literal[1]
    deck: ExportDeckData
