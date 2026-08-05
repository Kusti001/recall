import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { updateEmail } from "@/shared/api/auth"

interface ChangeEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentEmail: string
  onSuccess: (email: string) => void
}

export function ChangeEmailDialog({
  open,
  onOpenChange,
  currentEmail,
  onSuccess,
}: ChangeEmailDialogProps) {
  const [email, setEmail] = useState(currentEmail)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setError(null)
    setLoading(true)
    try {
      const updated = await updateEmail(email)
      onSuccess(updated.email)
      onOpenChange(false)
    } catch {
      setError("Не удалось обновить email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменить email</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground">Новый email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={currentEmail}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={loading || !email || email === currentEmail}
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
