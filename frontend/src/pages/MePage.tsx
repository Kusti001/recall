import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentUser, logout, type User } from "@/shared/api/api"

export function MePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Токен не найден. Сначала войдите в аккаунт.")
        setLoading(false)
        return
      }

      try {
        const me = await getCurrentUser()
        setUser(me)
        setError(null)
      } catch {
        setUser(null)
        setError("Не удалось загрузить профиль. Попробуйте войти заново.")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate("/login", { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Проверяем авторизацию...</div>
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Профиль</h1>
        <p className="text-sm text-muted-foreground">Состояние текущей сессии и данные пользователя.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {user ? (
        <div className="space-y-3 rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex justify-between gap-4 border-b pb-2 text-sm">
            <span className="text-muted-foreground">ID</span>
            <span className="font-mono">{user.id}</span>
          </div>
          <div className="flex justify-between gap-4 border-b pb-2 text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Статус</span>
            <span className={user.is_active ? "font-medium text-emerald-600" : "font-medium text-amber-600"}>
              {user.is_active ? "Активен" : "Неактивен"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? "Выходим..." : "Выйти из аккаунта"}
          </button>
        </div>
      ) : (
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{error ?? "Профиль недоступен."}</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Перейти к входу
          </button>
        </div>
      )}
    </div>
  )
}
