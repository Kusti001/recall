import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ReviewDeckCard } from "@/components/ReviewMenuPage/ReviewDeckCard"

import { getReviewDecks } from "@/shared/api/api"

import type {DecksResponse } from "@/shared/api/api"

export function ReviewMenuPage() {
  const [data, setData] = useState<DecksResponse | null>(null)

  useEffect(() => {
    async function load() {
      const response = await getReviewDecks()
      setData(response)
    }

    load()
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <main className="mx-auto max-w-5xl px-8 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl">Повторение</h1>

        <p className="mt-2 text-muted-foreground">
          {data.total_due} карточек ждут повторения
        </p>
      </div>

      <Link to="/review/all">
        <Button className="mb-8 w-full">Повторить всё</Button>
      </Link>

      <section>
        <h2 className="mb-4 text-lg font-medium">Колоды</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {data.decks.map((deck) => (
            <ReviewDeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      </section>
    </main>
  )
}
