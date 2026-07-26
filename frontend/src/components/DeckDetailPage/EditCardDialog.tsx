import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import type { CardDetail } from "@/shared/api/api"

interface EditCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card: CardDetail | null
  onSave: (id: number, front: string, back: string) => Promise<CardDetail>
}

export function EditCardDialog({
  open,
  onOpenChange,
  card,
  onSave,
}: EditCardDialogProps) {
  const [front, setFront] = useState(card?.front ?? "")
  const [back, setBack] = useState(card?.back ?? "")

  async function handleSave() {
    if (!card) return
    await onSave(card.id, front, back)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменить карточку</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
              Обратная сторона
            </label>
            <textarea
              className="mt-1 min-h-24 w-full rounded-md border px-3 py-2"
              value={back}
              onChange={(e) => setBack(e.target.value)}
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
