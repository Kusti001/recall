import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { createDeck } from "@/shared/api/api"

interface Props {
  open: boolean
  onOpenChange: (value: boolean) => void
  onCreated: () => Promise<void>
}

export function CreateDeckDialog({ open, onOpenChange, onCreated }: Props) {
  const [title, setTitle] = useState("")

  async function handleCreate() {
    await createDeck(title)

    await onCreated()

    setTitle("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая колода</DialogTitle>
        </DialogHeader>

        <input
          className="rounded-md border px-3 py-2"
          placeholder="Название колоды"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <DialogFooter>
          <Button disabled={!title} onClick={handleCreate}>
            Создать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
