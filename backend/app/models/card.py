from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models import Deck, Review, User


class Status(str, Enum):
    NEW = "new"
    LEARNING = "learning"
    MASTERED = "mastered"


class Card(Base):
    __tablename__ = "card"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id"), index=True)
    deck_id: Mapped[int | None] = mapped_column(
        ForeignKey("deck.id", ondelete="SET NULL"), index=True
    )

    status: Mapped[Status] = mapped_column(
        SQLEnum(
            Status, name="card_status", values_callable=lambda x: [e.value for e in x]
        ),
        default=Status.NEW,
        nullable=False,
    )
    status_override: Mapped[bool] = mapped_column(default=False, nullable=False)
    front: Mapped[str] = mapped_column()
    front_description: Mapped[str | None] = mapped_column(nullable=True)

    back: Mapped[str] = mapped_column()
    back_description: Mapped[str | None] = mapped_column(nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # SRS fields - research needed
    next_review: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    interval: Mapped[int] = mapped_column(default=1)
    ease_factor: Mapped[float] = mapped_column(default=2.5)
    success_streak: Mapped[int] = mapped_column(default=0)  # (rating >= 3)
    total_reviews: Mapped[int] = mapped_column(default=0)

    user: Mapped["User"] = relationship(back_populates="cards")
    deck: Mapped["Deck"] = relationship(back_populates="cards")
    reviews: Mapped[list["Review"]] = relationship(back_populates="card")
