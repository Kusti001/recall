import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { updatePassword } from "@/shared/api/auth"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword

  async function handleSave() {
    if (mismatch || !password) return
    setError(null)
    setLoading(true)
    try {
      await updatePassword(password)
      setPassword("")
      setConfirmPassword("")
      onOpenChange(false)
    } catch (err: any) {
      // Parse backend error response
      let message = "Не удалось обновить пароль"
      
      if (err?.response?.data?.detail) {
        const detail = err.response.data.detail
        if (typeof detail === "object" && detail.reason) {
          message = detail.reason
        } else if (typeof detail === "string") {
          message = detail
        }
      } else if (err?.response?.data?.message) {
        message = err.response.data.message
      }
      
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменить пароль</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          {mismatch && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-center text-sm text-destructive">
              Пароли не совпадают
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground">
              Новый пароль
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={mismatch && confirmPassword ? "border-destructive" : ""}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Подтвердите пароль
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={mismatch && confirmPassword ? "border-destructive" : ""}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={loading || !password || !confirmPassword || mismatch}
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
