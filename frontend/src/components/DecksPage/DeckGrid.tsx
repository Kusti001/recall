import { Button } from "@/components/ui/button"
import { DeckCard } from "./DeckCard"

import type { DeckStats } from "@/shared/api/api"
import { useTranslation } from "react-i18next"

interface Props {
  decks: DeckStats[]
  onCreate: () => void
}

export function DeckGrid({ decks, onCreate }: Props) {
  const { t } = useTranslation("decks")
  return (
    <section className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}

      <Button
        variant="outline"
        onClick={onCreate}
        className="flex h-full min-h-48 flex-col gap-3 border-dashed"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full border text-xl">
          +
        </span>

        {t("create_deck")}
      </Button>
    </section>
  )
}
