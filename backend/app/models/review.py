from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models import Card, User


class Review(Base):
    __tablename__ = "review"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), index=True)
    card_id: Mapped[int | None] = mapped_column(
            ForeignKey("card.id", ondelete="CASCADE"), index=True
        )

    rating: Mapped[int] = mapped_column()

    reviewed_at: Mapped[datetime] = mapped_column(server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="reviews")
    card: Mapped["Card"] = relationship(back_populates="reviews")
