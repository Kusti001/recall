import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { createDeck, getDecks, type Deck } from "@/shared/api/api"

export function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [newDeckTitle, setNewDeckTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

  const loadDecks = async () => {
    const data = await getDecks()
    setDecks(data.decks)
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        await loadDecks()
      } catch {
        setStatusMessage("Не удалось загрузить колоды.")
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault()
    const title = newDeckTitle.trim()
    if (!title) return

    setBusy(true)
    setStatusMessage("")

    try {
      await createDeck(title)
      await loadDecks()
      setNewDeckTitle("")
      setStatusMessage("Колода создана.")
    } catch {
      setStatusMessage("Не удалось создать колоду.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Колоды</h1>
        <p className="text-sm text-muted-foreground">Выбирай колоду, чтобы открыть страницу с полным CRUD карточек.</p>
      </div>

      {statusMessage && (
        <div className="rounded-lg border bg-muted/40 p-3 text-sm text-foreground">{statusMessage}</div>
      )}

      <section className="rounded-xl border bg-background p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Создать новую колоду</h2>
        <form onSubmit={handleCreateDeck} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Название новой колоды"
            value={newDeckTitle}
            onChange={(e) => setNewDeckTitle(e.target.value)}
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <Button type="submit" disabled={busy} className="sm:w-auto">
            Создать
          </Button>
        </form>
      </section>

      <section className="rounded-xl border bg-background p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Мои колоды</h2>
            <p className="text-sm text-muted-foreground">{loading ? "Загрузка..." : `Всего: ${decks.length}`}</p>
          </div>
        </div>

        {decks.length === 0 && !loading ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Пока нет ни одной колоды. Создай первую выше.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <article key={deck.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{deck.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">ID: {deck.id}</p>
                  </div>
                  <Link
                    to={`/decks/${deck.id}`}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                  >
                    Открыть
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {deck.created_at && <span>Создана: {new Date(deck.created_at).toLocaleDateString()}</span>}
                  {deck.updated_at && <span>Обновлена: {new Date(deck.updated_at).toLocaleDateString()}</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
