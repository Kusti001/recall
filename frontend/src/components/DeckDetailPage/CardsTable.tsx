import type { CardListItem } from "@/shared/api/api"

interface CardsTableProps {
  cards: CardListItem[]
  selectedCardId: number | null
  onSelectCard: (card: CardListItem) => void
}

export function CardsTable({ cards, selectedCardId, onSelectCard }: CardsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-7 border-b bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <span></span>
        <span>Лицо</span>
        <span>Оборот</span>
        <span>Интервал</span>
        <span>Статус</span>
        <span>Правильных ответов поряд</span>
        <span>Ответов всего</span>
      </div>
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={() => onSelectCard(card)}
          className={`grid w-full grid-cols-7 items-center border-b px-4 py-3 text-left text-sm hover:bg-muted/50 ${
            selectedCardId === card.id ? "bg-muted" : ""
          }`}
        >
          <span><input type="checkbox" /></span>
          <span className="truncate font-medium">{card.front}</span>
          <span className="truncate text-muted-foreground">{card.back}</span>
          <span>{card.interval} дней</span>
          <span className="text-muted-foreground">{card.status}</span>
          <span>{card.success_streak}</span>
          <span>{card.total_reviews}</span>
        </button>
      ))}
    </div>
  )
}
