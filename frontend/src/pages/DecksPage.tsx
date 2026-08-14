import { useEffect, useState } from "react"

import { getDecks } from "@/shared/api/api"
import type { DecksResponse } from "@/shared/api/api"

import { DecksHeader } from "@/components/DecksPage/DecksHeader"
import { DeckGrid } from "@/components/DecksPage/DeckGrid"
import { DeckDialog } from "@/components/DecksPage/DeckDialog/DeckDialog"

export function DecksPage() {
  const [data, setData] = useState<DecksResponse | null>(null)
  const [deckDialogOpen, setDeckDialogOpen] = useState(false)

  async function loadDecks() {
    const response = await getDecks()
    setData(response)
  }

  useEffect(() => {
    async function load() {
      const response = await getDecks()
      setData(response)
    }

    load()
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <main className="mx-auto max-w-7xl px-8 py-12">
      <DecksHeader
        totalDecks={data.total_decks}
        totalDue={data.total_due}
        onCreate={() => setDeckDialogOpen(true)}
      />

      <DeckGrid decks={data.decks} onCreate={() => setDeckDialogOpen(true)} />

      <DeckDialog
        open={deckDialogOpen}
        onOpenChange={setDeckDialogOpen}
        onCreated={loadDecks}
      />
    </main>
  )
}
