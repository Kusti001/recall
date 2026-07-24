from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models import Deck, User, Review


class Card(Base):
    __tablename__ = "card"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), index=True)
    deck_id: Mapped[int | None] = mapped_column(
            ForeignKey("deck.id", ondelete="SET NULL"), index=True
        )

    front: Mapped[str] = mapped_column()
    back: Mapped[str] = mapped_column()

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )

    # SRS fields - research needed
    next_review: Mapped[datetime] = mapped_column(server_default=func.now())
    interval: Mapped[int] = mapped_column(default=1)
    ease_factor: Mapped[float] = mapped_column(default=2.5)
    reviews_count: Mapped[int] = mapped_column(default=0)

    user: Mapped["User"] = relationship(back_populates="cards")
    deck: Mapped["Deck"] = relationship(back_populates="cards")
    reviews: Mapped[list["Review"]] = relationship(back_populates="card")
