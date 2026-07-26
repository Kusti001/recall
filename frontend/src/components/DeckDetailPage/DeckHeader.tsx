import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

interface DeckHeaderProps {
  title: string
  totalCards: number
  dueCards: number
  deckId: number
  onAddCard: () => void
}

export function DeckHeader({
  title,
  totalCards,
  dueCards,
  deckId,
  onAddCard,
}: DeckHeaderProps) {
  return (
    <div className="pb-6">
      <div className="text-sm text-muted-foreground">Колоды / {title}</div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">
            {totalCards} карточек · {dueCards} к повторению сегодня
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onAddCard}>
            + Добавить карточку
          </Button>
          <Link to={`/review/${deckId}`}>
            <Button>Повторить сейчас</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
