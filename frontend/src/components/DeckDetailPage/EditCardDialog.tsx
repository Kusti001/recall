import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import type { CardDetail } from "@/shared/api/api"

interface UpdateCardData {
  id: number
  front: string
  frontDescription: string
  back: string
  backDescription: string
}

interface EditCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card: CardDetail | null
  onSave: (data: UpdateCardData) => Promise<CardDetail>
}

export function EditCardDialog({
  open,
  onOpenChange,
  card,
  onSave,
}: EditCardDialogProps) {
  const [front, setFront] = useState("")
  const [frontDescription, setFrontDescription] = useState("")
  const [back, setBack] = useState("")
  const [backDescription, setBackDescription] = useState("")

  // важно, потому что Dialog открывается с другой карточкой
  useEffect(() => {
    if (!card) return

    setFront(card.front)
    setFrontDescription(card.front_description ?? "")
    setBack(card.back)
    setBackDescription(card.back_description ?? "")
  }, [card])

  async function handleSave() {
    if (!card) return

    await onSave({
      id: card.id,
      front,
      frontDescription,
      back,
      backDescription,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Изменить карточку</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-muted-foreground">
              Лицевая сторона
            </label>

            <textarea
              className="mt-1 min-h-24 w-full rounded-md border px-3 py-2"
              value={front}
              onChange={(e) => setFront(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Описание лицевой стороны
            </label>

            <textarea
              className="mt-1 min-h-20 w-full rounded-md border px-3 py-2"
              placeholder="Дополнительная информация..."
              value={frontDescription}
              onChange={(e) => setFrontDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Обратная сторона
            </label>

            <textarea
              className="mt-1 min-h-24 w-full rounded-md border px-3 py-2"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Описание обратной стороны
            </label>

            <textarea
              className="mt-1 min-h-20 w-full rounded-md border px-3 py-2"
              placeholder="Примеры, заметки, пояснения..."
              value={backDescription}
              onChange={(e) => setBackDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button disabled={!front || !back} onClick={handleSave}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
