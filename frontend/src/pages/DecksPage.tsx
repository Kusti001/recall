import { useEffect, useState } from "react"

import { getDecks } from "@/shared/api/api"
import type { DecksResponse } from "@/shared/api/api"

import { DecksHeader } from "@/components/DecksPage/DecksHeader"
import { DeckGrid } from "@/components/DecksPage/DeckGrid"
import { CreateDeckDialog } from "@/components/DecksPage/CreateDeckDialog"

export function DecksPage() {
  const [data, setData] = useState<DecksResponse | null>(null)
  const [open, setOpen] = useState(false)

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
        onCreate={() => setOpen(true)}
      />

      <DeckGrid decks={data.decks} onCreate={() => setOpen(true)} />

      <CreateDeckDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={loadDecks}
      />
    </main>
  )
}
