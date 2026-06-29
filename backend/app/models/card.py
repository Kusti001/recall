from app.db.base import Base
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    deck: Mapped[int| None] = mapped_column(ForeignKey("decks.id"), index=True)

    face: Mapped[str] = mapped_column()
    back: Mapped[str] = mapped_column()


    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())

    #SRS fields - research needed
    next_review: Mapped[datetime | None] = mapped_column()
    interval: Mapped[int] = mapped_column(default=1)
    ease_factor: Mapped[float] = mapped_column(default=2.5)
    reviews_count: Mapped[int] = mapped_column(default=0)

    user: Mapped["User"] = relationship(back_populates="cards")
