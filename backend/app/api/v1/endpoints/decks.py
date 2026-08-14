from app.core.dependencies import get_current_user
from app.core.exceptions import NotFoundError, PermissionDeniedError
from app.db.session import get_async_session
from app.models import User
from app.schemas import (
    DeckCardsResponse,
    DeckCreate,
    DeckRead,
    DecksResponse,
    DeckStats,
    GeneratedDeck,
    GenerateDeckRequest,
    ImportDeckRequest,
)
from app.services import AIService, DeckService
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/decks", tags=["v1 / decks"])


@router.get("/{deck_id}", response_model=DeckStats)
async def get_deck_stats(
    deck_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    try:
        data = await service.get_deck_stats(user_id=user.id, deck_id=deck_id)
        return data
    except NotFoundError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionDeniedError as e:
        await session.rollback()
        raise HTTPException(status_code=403, detail=str(e))


@router.get("", response_model=DecksResponse)
async def get_decks(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    data = await service.get_decks(user_id=user.id)
    return data


@router.post("", response_model=DeckRead)
async def create_deck(
    data: DeckCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    deck = await service.create_deck(user_id=user.id, data=data)
    await session.commit()
    return DeckRead.model_validate(deck)


@router.delete("/{deck_id}", status_code=204)
async def delete_deck(
    deck_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    try:
        await service.delete_deck(user_id=user.id, deck_id=deck_id)
        await session.commit()
    except NotFoundError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionDeniedError as e:
        await session.rollback()
        raise HTTPException(status_code=403, detail=str(e))


@router.patch("/{deck_id}", response_model=DeckRead)
async def update_deck(
    deck_id: int,
    data: DeckCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    try:
        deck = await service.update_deck(user_id=user.id, data=data, deck_id=deck_id)
        await session.commit()
        return DeckRead.model_validate(deck)
    except NotFoundError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionDeniedError as e:
        await session.rollback()
        raise HTTPException(status_code=403, detail=str(e))


@router.get("/{deck_id}/cards", response_model=DeckCardsResponse)
async def get_cards_by_deck(
    deck_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    try:
        data = await service.get_cards_by_deck(user_id=user.id, deck_id=deck_id)
        return data
    except NotFoundError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionDeniedError as e:
        await session.rollback()
        raise HTTPException(status_code=403, detail=str(e))


@router.get("/{deck_id}/export")
async def export_deck(
    deck_id: int,
    format: str = "json",
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)
    try:
        data = await service.export_deck(
            user_id=user.id, deck_id=deck_id, format=format
        )
        json_data = data.model_dump_json(indent=2)

        return Response(
            content=json_data,
            media_type="application/json",
            headers={
                "Content-Disposition": f'attachment; filename="deck_{deck_id}.json"'
            },
        )
    except NotFoundError as e:
        await session.rollback()
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionDeniedError as e:
        await session.rollback()
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/import/preview", response_model=GeneratedDeck)
async def preview_import_deck(
    data: ImportDeckRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)

    try:
        result = service.preview_import_deck(deck_data=data.deck)
        return result
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionDeniedError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/import")
async def import_deck(
    data: ImportDeckRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    service = DeckService(session)

    try:
        result = await service.import_deck(
            user_id=user.id,
            deck_data=data.deck,
        )

        return result

    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionDeniedError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.post("/generate", response_model=GeneratedDeck)
async def generate_deck(
    data: GenerateDeckRequest,
    user: User = Depends(get_current_user),
):
    service = AIService()

    try:
        result = await service.generate_deck(
            prompt=data.prompt,
            card_count=data.card_count,
        )

        return result

    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionDeniedError as e:
        raise HTTPException(status_code=403, detail=str(e))
