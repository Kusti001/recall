from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, PermissionDeniedError
from app.models import Card, Deck
from app.repositories import DeckRepository
from app.schemas import (
    CardListItem,
    DeckCardsResponse,
    DeckCreate,
    DecksResponse,
    DeckStats,
    ExportCard,
    ExportDeckData,
    ExportDeckResponse,
)


class DeckService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.decks = DeckRepository(session)

    async def create_deck(self, user_id: UUID, data: DeckCreate):
        card = await self.decks.create(user_id=user_id, title=data.title)
        return card

    async def get_deck_stats(self, user_id: UUID, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)
        if not deck or deck.user_id != user_id:
            raise NotFoundError("Deck not found")
        if deck.user_id != user_id:
            raise PermissionDeniedError("Access denied")

        deck = await self.decks.get_deck_stats(deck_id)
        return deck

    async def get_decks(self, user_id: UUID):

        rows = await self.decks.get_decks(user_id)

        decks = [DeckStats.model_validate(row) for row in rows]

        return DecksResponse(
            decks=decks,
            total_due=sum(deck.due_cards for deck in decks),
            total_decks=len(decks),
        )

    async def delete_deck(self, user_id: UUID, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)

        if not deck or deck.user_id != user_id:
            raise NotFoundError("Deck not found")
        if deck.user_id != user_id:
            raise PermissionDeniedError("Access denied")

        await self.decks.delete(deck)

    async def update_deck(self, user_id: UUID, data: DeckCreate, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)
        if not deck or deck.user_id != user_id:
            raise NotFoundError("Deck not found")
        if deck.user_id != user_id:
            raise PermissionDeniedError("Access denied")
        deck.title = data.title
        return deck

    async def get_cards_by_deck(self, user_id: UUID, deck_id: int):
        deck = await self.decks.get_by_id(deck_id)

        if not deck:
            raise NotFoundError("Deck not found")

        if deck.user_id != user_id:
            raise PermissionDeniedError("Access denied")

        cards = await self.decks.get_cards_by_deck(deck_id)

        return DeckCardsResponse(
            cards=[CardListItem.model_validate(card) for card in cards],
            total_cards=len(cards),
        )

    async def export_deck(self, user_id: UUID, deck_id: int, format: str):
        deck = await self.decks.get_by_id(deck_id)

        if not deck:
            raise NotFoundError("Deck not found")

        if deck.user_id != user_id:
            raise PermissionDeniedError("Access denied")

        cards = await self.decks.get_cards_by_deck(deck_id)

        return ExportDeckResponse(
            deck=ExportDeckData(
                title=deck.title,
                cards=[
                    ExportCard(
                        front=card.front,
                        front_description=card.front_description,
                        back=card.back,
                        back_description=card.back_description,
                    )
                    for card in cards
                ],
            )
        )

    async def import_deck(
        self,
        user_id: UUID,
        deck_data: ExportDeckData,
    ) -> Deck:
        deck_data = self.preview_import_deck(deck_data)
        deck = Deck(
            user_id=user_id,
            title=deck_data.title,
        )

        self.session.add(deck)
        await self.session.flush()

        for card_data in deck_data.cards:
            card = Card(
                user_id=user_id,
                deck_id=deck.id,
                front=card_data.front,
                front_description=card_data.front_description,
                back=card_data.back,
                back_description=card_data.back_description,
            )

            self.session.add(card)

        await self.session.commit()
        await self.session.refresh(deck)

        return deck

    def preview_import_deck(self, deck_data: ExportDeckData) -> ExportDeckData:
        return ExportDeckData.model_validate(deck_data)
