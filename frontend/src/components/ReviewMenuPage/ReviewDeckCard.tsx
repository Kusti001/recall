import { Link } from "react-router-dom"
import type { DeckStats } from "@/shared/api/api"

interface Props {
  deck: DeckStats
}

export function ReviewDeckCard({ deck }: Props) {
  const progress = deck.total_cards
    ? Math.round((deck.mastered / deck.total_cards) * 100)
    : 0

  return (
    <Link
      to={`/review/deck/${deck.id}`}
      className="flex flex-col gap-4 rounded-xl border p-5 transition hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="truncate font-medium">{deck.title}</h3>

        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
          {deck.due} сегодня
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        {deck.total_cards} карточек
      </p>

      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <span className="w-10 text-right font-mono text-xs text-muted-foreground">
          {progress}%
        </span>
      </div>
    </Link>
  )
}
