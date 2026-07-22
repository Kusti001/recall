

from pydantic import BaseModel


class CardReviewSchema(BaseModel):
    rating: int
