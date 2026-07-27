import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTitle: string
  onSave: (title: string) => Promise<void>
}

export function EditDeckDialog({ open, onOpenChange, currentTitle, onSave }: Props) {
  const [title, setTitle] = useState(currentTitle)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setTitle(currentTitle)
  }, [open, currentTitle])

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    try {
      await onSave(title.trim())
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Переименовать колоду</DialogTitle>
        </DialogHeader>
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Название колоды"
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSave()
          }}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
