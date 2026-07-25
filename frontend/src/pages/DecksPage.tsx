import { Button } from "@/components/ui/button"
//import { Input } from "@/components/ui/input"
import { DeckCard } from "@/components/DecksPage/DeckCard"
import { useEffect, useState } from "react"
import { getDecks, createDeck } from "@/shared/api/api"
import type { DecksResponse } from "@/shared/api/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function DecksPage() {

  const [data, setData] = useState<DecksResponse | null>(null)

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")

    useEffect(() => {
      async function loadDecks() {
        const response = await getDecks()
        setData(response)
      }

      loadDecks()
    }, [])

    if (!data) {
      return <div>Loading...</div>
    }


  return (
    <main className="mx-auto max-w-7xl px-8 py-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl">Колоды</h1>

          <p className="mt-2 text-muted-foreground">
            {data.total_decks} колод · {data.total_due} карточек к повторению сегодня
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>+ Новая колода</Button>
      </div>
      {/* filters
      <div className="mt-8 flex gap-3">
        <Input placeholder="Найти колоду…" />

        <Button variant="secondary">Все</Button>
        <Button variant="outline">Есть к повторению</Button>
      </div>
      { */}
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.decks.map((deck) => (
                <DeckCard key={deck.id} deck={deck} />
                ))}

        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="flex h-full min-h-64 flex-col gap-3 border-dashed"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border text-xl">
            +
          </span>

          Создать колоду
        </Button>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Новая колода
            </DialogTitle>
          </DialogHeader>

          <input
            className="border rounded-md px-3 py-2"
            placeholder="Название колоды"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <DialogFooter>
            <Button
              onClick={async () => {
                await createDeck(title)

                const response = await getDecks()
                setData(response)

                setTitle("")
                setOpen(false)
              }}
            >
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
