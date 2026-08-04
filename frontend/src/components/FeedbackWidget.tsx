import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { submitFeedback } from "@/shared/api/feedback"

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  async function handleSubmit() {
    await submitFeedback(message)
    setSent(true)
    setMessage("")
    setTimeout(() => {
      setSent(false)
      setOpen(false)
    }, 1500)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 rounded-full border bg-background px-4 py-2 text-sm shadow-lg hover:bg-muted"
      >
        Обратная связь
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Есть что сказать?</DialogTitle>
          </DialogHeader>

          {sent ? (
            <p className="py-6 text-center text-muted-foreground">
              Спасибо! 🙌
            </p>
          ) : (
            <>
              <textarea
                className="min-h-32 w-full rounded-md border px-3 py-2"
                placeholder="Баг, идея, что угодно..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <DialogFooter>
                <Button onClick={handleSubmit} disabled={!message.trim()}>
                  Отправить
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
