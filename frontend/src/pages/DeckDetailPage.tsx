import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import {
  createCard,
  deleteCard,
  deleteDeck,
  getCardDetail,
  getDeckCards,
  getDeckStats,
  updateCard,
  updateDeck,
} from "@/shared/api/api"

import type {
  CardDetail,
  CardListItem,
  DeckStats,
  UpdateCardData,
} from "@/shared/api/types"

import { Button } from "@/components/ui/button"

import { DeckHeader } from "@/components/DeckDetailPage/DeckHeader"
import { CardsTable } from "@/components/DeckDetailPage/CardsTable"
import { CardsGrid } from "@/components/DeckDetailPage/CardsGrid"
import { CardPreview } from "@/components/DeckDetailPage/CardPreview"
import { CreateCardDialog } from "@/components/DeckDetailPage/CreateCardDialog"
import { EditCardDialog } from "@/components/DeckDetailPage/EditCardDialog"
import { EditDeckDialog } from "@/components/DeckDetailPage/EditDeckDialog"
import { DeleteDeckDialog } from "@/components/DeckDetailPage/DeleteDeckDialog"
import { DeleteCardDialog } from "@/components/DeckDetailPage/DeleteCardDialog"

type ViewMode = "list" | "grid"

export function DeckDetailPage() {
  const { t } = useTranslation("deck_detail")
  const { id } = useParams()
  const navigate = useNavigate()

  const deckId = Number(id)

  // Data
  const [deck, setDeck] = useState<DeckStats | null>(null)
  const [cards, setCards] = useState<CardListItem[]>([])
  const [cardDetails, setCardDetails] = useState<Record<number, CardDetail>>({})

  // Selection
  const [selectedCard, setSelectedCard] = useState<CardListItem | null>(null)
  const [cardToDelete, setCardToDelete] = useState<CardListItem | null>(null)

  // Dialogs
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editDeckOpen, setEditDeckOpen] = useState(false)
  const [deleteDeckOpen, setDeleteDeckOpen] = useState(false)

  // UI
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  /*
   * Load deck
   */

  useEffect(() => {
    if (!id) return

    async function loadDeck() {
      const [deckData, cardsData] = await Promise.all([
        getDeckStats(deckId),
        getDeckCards(deckId),
      ])

      setDeck(deckData)
      setCards(cardsData.cards)

      const firstCard = cardsData.cards[0]

      if (!firstCard) return

      setSelectedCard(firstCard)

      const detail = await getCardDetail(firstCard.id)

      setCardDetails((prev) => ({
        ...prev,
        [firstCard.id]: detail,
      }))
    }

    loadDeck()
  }, [id, deckId])

  /*
   * Card selection
   */

  async function handleSelectCard(card: CardListItem) {
    setSelectedCard(card)

    if (cardDetails[card.id]) {
      return
    }

    const detail = await getCardDetail(card.id)

    setCardDetails((prev) => ({
      ...prev,
      [card.id]: detail,
    }))
  }

  async function handleEditCard(card: CardListItem) {
    setSelectedCard(card)

    if (!cardDetails[card.id]) {
      const detail = await getCardDetail(card.id)

      setCardDetails((prev) => ({
        ...prev,
        [card.id]: detail,
      }))
    }

    setEditOpen(true)
  }

  /*
   * Card creation
   */

  async function handleCreateCard(
    front: string,
    back: string,
    frontDescription: string,
    backDescription: string
  ) {
    const card = await createCard({
      deck_id: deckId,
      front,
      back,
      front_description: frontDescription,
      back_description: backDescription,
    })

    setCards((prev) => [...prev, card])
    setCreateOpen(false)
  }

  /*
   * Card update
   */

  async function handleUpdateCard({
    id,
    front,
    back,
    frontDescription,
    backDescription,
  }: UpdateCardData) {
    const updated = await updateCard({
      card_id: id,
      front,
      back,
      front_description: frontDescription,
      back_description: backDescription,
    })

    setCardDetails((prev) => ({
      ...prev,
      [updated.id]: updated,
    }))

    setCards((prev) =>
      prev.map((card) =>
        card.id === updated.id
          ? {
              ...card,
              ...updated,
            }
          : card
      )
    )

    setSelectedCard((prev) =>
      prev?.id === updated.id
        ? {
            ...prev,
            ...updated,
          }
        : prev
    )

    setEditOpen(false)

    return updated
  }

  /*
   * Card deletion
   */

  function requestDeleteCard(card: CardListItem) {
    setCardToDelete(card)
  }

  async function handleDeleteCard(card: CardListItem) {
    await deleteCard(card.id)

    setCards((prev) => prev.filter((item) => item.id !== card.id))

    setCardDetails((prev) => {
      const next = { ...prev }
      delete next[card.id]
      return next
    })

    setSelectedCard((prev) => (prev?.id === card.id ? null : prev))

    setCardToDelete(null)
  }

  /*
   * Deck
   */

  async function handleRenameDeck(title: string) {
    if (!deck) return

    const updated = await updateDeck(deck.id, title)

    setDeck((prev) =>
      prev
        ? {
            ...prev,
            title: updated.title,
          }
        : prev
    )

    setEditDeckOpen(false)
  }

  async function handleDeleteDeck() {
    if (!deck) return

    await deleteDeck(deck.id)

    navigate("/decks")
  }

  /*
   * Derived state
   */

  const selectedDetail = selectedCard ? cardDetails[selectedCard.id] : null

  if (!deck) {
    return <div>Loading...</div>
  }

  return (
    <main className="mx-auto max-w-7xl px-8 py-12">
      <DeckHeader
        title={deck.title}
        totalCards={deck.total_cards}
        dueCards={deck.due_cards}
        deckId={deck.id}
        onAddCard={() => setCreateOpen(true)}
        onDeleteDeck={() => setDeleteDeckOpen(true)}
        onEditDeck={() => setEditDeckOpen(true)}
      />

      {/* View switcher */}
      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("grid")}
        >
          {t("view_mode.grid")}
        </Button>

        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
        >
          {t("view_mode.table")}
        </Button>
      </div>

      {/* Cards */}
      <section className="mt-4 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        {viewMode === "list" ? (
          <CardsTable
            cards={cards}
            selectedCardId={selectedCard?.id ?? null}
            onSelectCard={handleSelectCard}
            onDeleteCard={requestDeleteCard}
            onEditCard={handleEditCard}
          />
        ) : (
          <CardsGrid
            cards={cards}
            selectedCardId={selectedCard?.id ?? null}
            onSelectCard={handleSelectCard}
          />
        )}

        {selectedDetail && (
          <CardPreview
            card={selectedDetail}
            onEdit={() => {
              if (selectedCard) {
                handleEditCard(selectedCard)
              }
            }}
            onDelete={() => {
              if (selectedCard) {
                requestDeleteCard(selectedCard)
              }
            }}
          />
        )}
      </section>

      {/* Card dialogs */}

      <CreateCardDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreateCard}
      />

      <EditCardDialog
        key={selectedDetail?.id}
        open={editOpen}
        onOpenChange={setEditOpen}
        card={selectedDetail}
        onSave={handleUpdateCard}
      />

      <DeleteCardDialog
        open={cardToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCardToDelete(null)
          }
        }}
        onConfirm={() => {
          if (!cardToDelete) return Promise.resolve()

          return handleDeleteCard(cardToDelete)
        }}
      />

      {/* Deck dialogs */}

      <EditDeckDialog
        open={editDeckOpen}
        onOpenChange={setEditDeckOpen}
        currentTitle={deck.title}
        onSave={handleRenameDeck}
      />

      <DeleteDeckDialog
        open={deleteDeckOpen}
        onOpenChange={setDeleteDeckOpen}
        deckTitle={deck.title}
        onConfirm={handleDeleteDeck}
      />
    </main>
  )
}
