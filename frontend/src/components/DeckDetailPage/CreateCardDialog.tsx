import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

interface CreateCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (front: string, back: string) => Promise<void>
}

export function CreateCardDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateCardDialogProps) {
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")

  async function handleCreate() {
    await onCreate(front, back)
    setFront("")
    setBack("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая карточка</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">
              Лицевая сторона
            </label>
            <textarea
              className="mt-1 min-h-24 w-full rounded-md border px-3 py-2"
              placeholder="Например: Как будет «я иду»?"
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
              placeholder="Например: yo voy — от ir"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={!front || !back}>
            Создать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
