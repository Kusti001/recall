import { Button } from "@/components/ui/button"
import { DeckCard } from "./DeckCard"

import type { DeckStats } from "@/shared/api/api"


interface Props {
  decks: DeckStats[]
  onCreate: () => void
}


export function DeckGrid({
  decks,
  onCreate,
}: Props) {

  return (
    <section
      className="
        mt-6 grid gap-4
        md:grid-cols-2
        xl:grid-cols-3
        auto-rows-fr
      "
    >

      {decks.map((deck) => (
        <DeckCard
          key={deck.id}
          deck={deck}
        />
      ))}


      <Button
        variant="outline"
        onClick={onCreate}
        className="
          flex h-full min-h-48
          flex-col gap-3
          border-dashed
        "
      >
        <span className="
          flex h-10 w-10
          items-center justify-center
          rounded-full border text-xl
        ">
          +
        </span>

        Создать колоду
      </Button>

    </section>
  )
}
