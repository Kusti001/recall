import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import type { CardDetail } from "@/shared/api/api"

interface CardPreviewProps {
  card: CardDetail
  onEdit: () => void
  onDelete: () => Promise<void>
}

export function CardPreview({ card, onEdit, onDelete }: CardPreviewProps) {
  return (
    <aside className="rounded-xl border p-6">
      <p className="text-xs text-muted-foreground uppercase">
        Просмотр карточки
      </p>
      <h2 className="mt-4 font-serif text-xl">{card.front}</h2>
      <div className="my-5 h-px w-12 bg-border" />
      <p className="text-muted-foreground">{card.back}</p>

      <div className="mt-8 border-t pt-6">
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">Интервал</p>
            <p>{card.interval} дней</p>
          </div>
          <div>
            <p className="text-muted-foreground">Следующий показ</p>
            <p>{new Date(card.next_review).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ответов</p>
            <p>{card.reviews_count}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Лёгкость</p>
            <p>{card.ease_factor}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex w-full gap-3">
        <Button variant="outline" className="flex-1" onClick={onEdit}>
          Изменить
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1">
              Удалить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить карточку?</AlertDialogTitle>
              <AlertDialogDescription>
                Это действие нельзя отменить. Карточка будет удалена навсегда.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Удалить</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  )
}
