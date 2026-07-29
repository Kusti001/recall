import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  getDeckStats,
  getDeckCards,
  getCardDetail,
  createCard,
  updateCard,
  deleteCard,
  updateDeck,
  deleteDeck,
} from "@/shared/api/api"
import type { DeckStats, CardListItem, CardDetail } from "@/shared/api/types"
import { DeckHeader } from "@/components/DeckDetailPage/DeckHeader"
import { CardsTable } from "@/components/DeckDetailPage/CardsTable"
import { CardPreview } from "@/components/DeckDetailPage/CardPreview"
import { CreateCardDialog } from "@/components/DeckDetailPage/CreateCardDialog"
import { EditCardDialog } from "@/components/DeckDetailPage/EditCardDialog"
import { EditDeckDialog } from "@/components/DeckDetailPage/EditDeckDialog"
import { DeleteDeckDialog } from "@/components/DeckDetailPage/DeleteDeckDialog"

export function DeckDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [deck, setDeck] = useState<DeckStats | null>(null)
  const [cards, setCards] = useState<CardListItem[]>([])
  const [selectedCard, setSelectedCard] = useState<CardListItem | null>(null)
  const [cardDetails, setCardDetails] = useState<Record<number, CardDetail>>({})
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editDeckOpen, setEditDeckOpen] = useState(false)
  const [deleteDeckOpen, setDeleteDeckOpen] = useState(false)

  async function handleSelectCard(card: CardListItem) {
    setSelectedCard(card)
    if (cardDetails[card.id]) return
    const detail = await getCardDetail(card.id)
    setCardDetails((prev) => ({ ...prev, [card.id]: detail }))
  }

  useEffect(() => {
    if (!id) return
    async function loadDeck() {
      const deckData = await getDeckStats(Number(id))
      const cardsData = await getDeckCards(Number(id))
      setDeck(deckData)
      setCards(cardsData.cards)
      if (cardsData.cards.length > 0) {
        const firstCard = cardsData.cards[0]
        setSelectedCard(firstCard)
        const detail = await getCardDetail(firstCard.id)
        setCardDetails((prev) => ({ ...prev, [firstCard.id]: detail }))
      }
    }
    loadDeck()
  }, [id])

  async function handleCreateCard(front: string, back: string) {
    await createCard(front, back, Number(id))
    const response = await getDeckCards(Number(id))
    setCards(response.cards)
    setCreateOpen(false)
  }

  async function handleUpdateCard(cardId: number, front: string, back: string) {
    const updated = await updateCard(cardId, front, back)
    setCardDetails((prev) => ({ ...prev, [updated.id]: updated }))
    setCards((prev) =>
      prev.map((c) =>
        c.id === updated.id
          ? { ...c, front: updated.front, back: updated.back }
          : c
      )
    )
    return updated
  }

  async function handleDeleteCard() {
    if (!selectedCard) return
    await deleteCard(selectedCard.id)
    setCards((prev) => prev.filter((c) => c.id !== selectedCard.id))
    setCardDetails((prev) => {
      const copy = { ...prev }
      delete copy[selectedCard.id]
      return copy
    })
    setSelectedCard(null)
  }

  async function handleRenameDeck(title: string) {
    if (!deck) return
    const updated = await updateDeck(deck.id, title)
    setDeck((prev) => (prev ? { ...prev, title: updated.title } : prev))
  }

  async function handleDeleteDeck() {
    if (!deck) return
    await deleteDeck(deck.id)
    navigate("/decks")
  }

  if (!deck) return <div>Loading...</div>

  const selectedDetail = selectedCard ? cardDetails[selectedCard.id] : null

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

      <section className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <CardsTable
          cards={cards}
          selectedCardId={selectedCard?.id ?? null}
          onSelectCard={handleSelectCard}
        />
        {selectedDetail && (
          <CardPreview
            card={selectedDetail}
            onEdit={() => setEditOpen(true)}
            onDelete={handleDeleteCard}
          />
        )}
      </section>

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
