import type { CardListItem } from "@/shared/api/api"

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
          className={`rounded-xl border p-4 text-left transition-colors hover:bg-muted/50 ${
            selectedCardId === card.id ? "border-primary" : ""
          }`}
        >
          <p className="truncate font-medium">{card.front}</p>
          <p className="truncate text-sm text-muted-foreground">
            {card.front_description}
          </p>
          <div className="my-2 h-px bg-border" />

          <p className="truncate font-medium">{card.back}</p>
          <p className="truncate text-sm text-muted-foreground">
            {card.back_description}
          </p>

          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>{card.interval} дней</span>
            <span>{card.reviews} ответов</span>
          </div>
        </button>
      ))}
    </div>
  )
}
