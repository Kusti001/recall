import { Link } from "react-router-dom"
import type { DeckStats } from "@/shared/api/api";
import { useTranslation } from "react-i18next"

export function DeckCard({ deck }: { deck: DeckStats }) {
  const { t } = useTranslation("decks")
  const progress = deck.total_cards
    ? Math.round((deck.mastered_cards / deck.total_cards) * 100)
    : 0;
  return (
    <Link
      to={`/decks/${deck.id}`}
      className="flex flex-col gap-4 rounded-2xl border bg-card p-6 transition hover:-translate-y-0.5 hover:border-foreground/20"
    >
      <div className="flex items-start justify-between">
        <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold text-background"
                  style={{ backgroundColor: "var(--color-blue-400)" }}
                >
                  {deck.title.slice(0, 2)}
                </div>
        {deck.due_cards > 0 ? (
          <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
            {t("cards_today", { count: deck.due_cards })}
          </span>
        ) : (
          <span className="rounded-full bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
            {t("no_cards_due")}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-medium">{deck.title}</h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {t("cards_total", { count: deck.total_cards })}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded bg-muted">
          <div
            className="h-full rounded bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="w-10 text-right font-mono text-xs text-muted-foreground">
          {progress}%
        </span>
      </div>
    </Link>
  )
}
