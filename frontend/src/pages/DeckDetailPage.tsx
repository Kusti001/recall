import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  createCard,
  deleteCard,
  deleteDeck,
  getDeck,
  updateCard,
  updateDeck,
  type DeckDetail,
  type DeckCard,
} from "@/shared/api/api"

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString() : "—"
}

export function DeckDetailPage() {
  const navigate = useNavigate()
  const { deckId } = useParams<{ deckId: string }>()
  const parsedDeckId = useMemo(() => Number(deckId), [deckId])

  const [deck, setDeck] = useState<DeckDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState("")

  const [deckTitle, setDeckTitle] = useState("")
  const [newFront, setNewFront] = useState("")
  const [newBack, setNewBack] = useState("")

  const [editingCardId, setEditingCardId] = useState<number | null>(null)
  const [editFront, setEditFront] = useState("")
  const [editBack, setEditBack] = useState("")

  const loadDeck = async () => {
    if (!Number.isFinite(parsedDeckId)) {
      setError("Некорректный id колоды.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await getDeck(parsedDeckId)
      setDeck(data)
      setDeckTitle(data.title)
      setEditingCardId(null)
    } catch {
      setDeck(null)
      setError("Не удалось загрузить колоду.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDeck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deck) return

    const title = deckTitle.trim()
    if (!title) return

    setBusy(true)
    setStatusMessage("")

    try {
      const updated = await updateDeck(deck.id, title)
      setDeck((current) =>
        current
          ? { ...current, title: updated.title, updated_at: updated.updated_at }
          : current,
      )
      setDeckTitle(updated.title)
      setStatusMessage("Колода обновлена.")
    } catch {
      setStatusMessage("Не удалось обновить колоду.")
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteDeck = async () => {
    if (!deck) return

    const confirmed = window.confirm("Удалить эту колоду? Все карточки внутри тоже будут удалены.")
    if (!confirmed) return

    setBusy(true)
    setStatusMessage("")

    try {
      await deleteDeck(deck.id)
      navigate("/decks", { replace: true })
    } catch {
      setStatusMessage("Не удалось удалить колоду.")
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    void loadDeck()
  }, [parsedDeckId])

  const startEditCard = (card: DeckCard) => {
    setEditingCardId(card.id)
    setEditFront(card.front)
    setEditBack(card.back)
    setStatusMessage("")
  }

  const cancelEditCard = () => {
    setEditingCardId(null)
    setEditFront("")
    setEditBack("")
  }

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deck) return

    const front = newFront.trim()
    const back = newBack.trim()
    if (!front || !back) return

    setBusy(true)
    setStatusMessage("")

    try {
      await createCard(deck.id, front, back)
      setNewFront("")
      setNewBack("")
      await loadDeck()
      setStatusMessage("Карточка создана.")
    } catch {
      setStatusMessage("Не удалось создать карточку.")
    } finally {
      setBusy(false)
    }
  }

  const handleUpdateCard = async (cardId: number) => {
    if (!deck) return

    const front = editFront.trim()
    const back = editBack.trim()
    if (!front || !back) return

    setBusy(true)
    setStatusMessage("")

    try {
      await updateCard(cardId, front, back)
      setEditingCardId(null)
      setEditFront("")
      setEditBack("")
      await loadDeck()
      setStatusMessage("Карточка обновлена.")
    } catch {
      setStatusMessage("Не удалось обновить карточку.")
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteCard = async (cardId: number) => {
    const confirmed = window.confirm("Удалить карточку?")
    if (!confirmed) return

    setBusy(true)
    setStatusMessage("")

    try {
      await deleteCard(cardId)
      if (editingCardId === cardId) {
        cancelEditCard()
      }
      await loadDeck()
      setStatusMessage("Карточка удалена.")
    } catch {
      setStatusMessage("Не удалось удалить карточку.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link to="/decks" className="hover:underline">
              ← К списку колод
            </Link>
          </p>
          <h1 className="text-2xl font-semibold">Детали колоды</h1>
        </div>
        {deck && <span className="rounded-full border px-3 py-1 text-sm text-muted-foreground">ID: {deck.id}</span>}
      </div>

      {statusMessage && (
        <div className="rounded-lg border bg-muted/40 p-3 text-sm text-foreground">{statusMessage}</div>
      )}

      {loading ? (
        <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">Загрузка...</div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
          <p>{error}</p>
          <Button type="button" className="mt-4" onClick={() => navigate("/decks")}>Вернуться к колодам</Button>
        </div>
      ) : deck ? (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-xl border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Информация</h2>
                <p className="text-sm text-muted-foreground">Название колоды и основные действия.</p>
              </div>
              <Button type="button" variant="outline" onClick={handleDeleteDeck} disabled={busy}>
                Удалить колоду
              </Button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Название</p>
                <p className="font-medium">{deck.title}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Создана</p>
                <p>{formatDate(deck.created_at)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Обновлена</p>
                <p>{formatDate(deck.updated_at)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground">Карточек</p>
                <p>{deck.cards.length}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateDeck} className="mt-4 flex flex-col gap-3">
              <label className="text-sm font-medium">Переименовать колоду</label>
              <input
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <Button type="submit" disabled={busy} className="w-fit">
                Сохранить
              </Button>
            </form>
          </section>

          <div className="flex flex-col gap-6">
            <section className="rounded-xl border bg-background p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Создать карточку</h2>
              <form onSubmit={handleCreateCard} className="flex flex-col gap-3">
                <textarea
                  placeholder="Лицевая сторона"
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  className="min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <textarea
                  placeholder="Обратная сторона"
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  className="min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <Button type="submit" disabled={busy} className="w-fit">
                  Создать карточку
                </Button>
              </form>
            </section>

            <section className="rounded-xl border bg-background p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Карточки</h2>
                <span className="text-sm text-muted-foreground">{deck.cards.length} шт.</span>
              </div>

              {deck.cards.length === 0 ? (
                <p className="text-sm text-muted-foreground">В этой колоде пока нет карточек.</p>
              ) : (
                <div className="space-y-3">
                  {deck.cards.map((card) => {
                    const isEditing = editingCardId === card.id

                    return (
                      <article key={card.id} className="rounded-xl border p-4">
                        {!isEditing ? (
                          <>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Front</p>
                                <p className="mt-1 font-medium">{card.front}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => startEditCard(card)}>
                                  Редактировать
                                </Button>
                                <Button type="button" variant="outline" onClick={() => void handleDeleteCard(card.id)} disabled={busy}>
                                  Удалить
                                </Button>
                              </div>
                            </div>

                            <div className="mt-3 rounded-md bg-muted/40 p-3 text-sm">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">Back</p>
                              <p className="mt-1">{card.back}</p>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {card.created_at && <span>Создана: {formatDate(card.created_at)}</span>}
                              {card.updated_at && <span>Обновлена: {formatDate(card.updated_at)}</span>}
                              {card.next_review && <span>След. повтор: {formatDate(card.next_review)}</span>}
                              {typeof card.ease_factor === "number" && <span>EF: {card.ease_factor}</span>}
                              {typeof card.interval === "number" && <span>Интервал: {card.interval}</span>}
                              {typeof card.reviews_count === "number" && <span>Повторов: {card.reviews_count}</span>}
                            </div>
                          </>
                        ) : (
                          <form className="flex flex-col gap-3" onSubmit={(e) => {
                            e.preventDefault()
                            void handleUpdateCard(card.id)
                          }}>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Редактирование карточки #{card.id}</p>
                              </div>
                              <Button type="button" variant="outline" onClick={cancelEditCard}>
                                Отмена
                              </Button>
                            </div>

                            <input
                              type="text"
                              value={editFront}
                              onChange={(e) => setEditFront(e.target.value)}
                              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                            <textarea
                              value={editBack}
                              onChange={(e) => setEditBack(e.target.value)}
                              className="min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                            <div className="flex gap-2">
                              <Button type="submit" disabled={busy}>
                                Сохранить
                              </Button>
                              <Button type="button" variant="outline" onClick={cancelEditCard}>
                                Отмена
                              </Button>
                            </div>
                          </form>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      ) : null}
    </div>
  )
}
