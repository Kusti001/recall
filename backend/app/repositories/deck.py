from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Deck


class DeckRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_id: UUID, title: str) -> Deck:
        card = Deck(user_id=user_id, title=title)
        self.session.add(card)
        await self.session.flush()
        return card
