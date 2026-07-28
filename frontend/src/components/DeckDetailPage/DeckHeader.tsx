import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Pencil, Trash2 } from "lucide-react"

interface DeckHeaderProps {
  title: string
  totalCards: number
  dueCards: number
  deckId: number
  onAddCard: () => void
  onEditDeck: () => void
  onDeleteDeck: () => void
}

export function DeckHeader({
  title,
  totalCards,
  dueCards,
  deckId,
  onAddCard,
  onDeleteDeck,
  onEditDeck,
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

        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEditDeck}>
              <Pencil className="mr-2 h-4 w-4" />
              Переименовать
            </Button>
            <Button variant="outline" size="sm" onClick={onDeleteDeck}>
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              Удалить
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onAddCard}>
              + Добавить карточку
            </Button>
            <Link to={`/review/deck/${deckId}`}>
              <Button>Повторить сейчас</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
