import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  getCurrentUser,
  logout as logoutRequest,
  type User,
} from "@/shared/api/api"
import { useAuth } from "@/shared/auth/useAuth"

export function MePage() {
  const navigate = useNavigate()

  const { token, logout } = useAuth()

  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        navigate("/login", { replace: true })
        return
      }

      try {
        const me = await getCurrentUser()

        setUser(me)
        setError(null)
      } catch {
        setUser(null)
        setError("Не удалось загрузить профиль.")

        logout()
        navigate("/login", { replace: true })
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [token, navigate, logout])

  async function handleLogout() {
    setLoggingOut(true)

    try {
      await logoutRequest()
    } catch {
      // даже если сервер не ответил,
      // локальную сессию всё равно закрываем
    } finally {
      logout()
      navigate("/", { replace: true })
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Проверяем авторизацию...
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Профиль</h1>

        <p className="text-sm text-muted-foreground">Данные вашего аккаунта.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {user && (
        <div className="space-y-3 rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex justify-between gap-4 border-b pb-2 text-sm">
            <span className="text-muted-foreground">Email</span>

            <span className="font-medium">{user.email}</span>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Статус</span>

            <span
              className={
                user.is_active
                  ? "font-medium text-emerald-600"
                  : "font-medium text-amber-600"
              }
            >
              {user.is_active ? "Активен" : "Неактивен"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-4 w-full rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? "Выходим..." : "Выйти из аккаунта"}
          </button>
        </div>
      )}
    </div>
  )
}
