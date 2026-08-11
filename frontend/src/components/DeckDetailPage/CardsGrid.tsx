import type { CardListItem } from "@/shared/api/api"
import { StatusBadge } from "./StatusBadge"

interface CardsGridProps {
  cards: CardListItem[]
  selectedCardId: number | null
  onSelectCard: (card: CardListItem) => void
}

export function CardsGrid({
  cards,
  selectedCardId,
  onSelectCard,
}: CardsGridProps) {
  return (
    <div className="grid auto-rows-fr grid-cols-2 gap-3 lg:grid-cols-3">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={() => onSelectCard(card)}
          className={`relative rounded-xl border p-4 text-left transition-colors hover:bg-muted/50 ${
            selectedCardId === card.id ? "border-primary" : ""
          }`}
        >
          <div className="absolute right-4 top-4 flex items-center gap-2">
            {card.success_streak > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>🔥</span>
                <span>{card.success_streak}</span>
              </div>
            )}

            <StatusBadge status={card.status} />
          </div>

          {/* Контент */}
          <div className="pr-20">
            <p className="truncate font-medium">{card.front}</p>
            <p className="truncate text-sm text-muted-foreground">
              {card.front_description}
            </p>

            <div className="my-2 h-px bg-border" />

            <p className="truncate font-medium">{card.back}</p>
            <p className="truncate text-sm text-muted-foreground">
              {card.back_description}
            </p>
          </div>

          {/* Статистика */}
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>{card.interval} дней</span>
            <span>{card.total_reviews} попыток</span>
          </div>
        </button>
      ))}
    </div>
  )
}
