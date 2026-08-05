import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import axios from "axios"
import { loginWithEmail, registerWithEmail } from "@/shared/api/api"

import { useAuth } from "@/shared/auth/useAuth"

export function AuthPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const location = useLocation()
  const isRegister = location.pathname === "/register"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setError(null)
    setLoading(true)

    try {
      if (isRegister) {
        await registerWithEmail(email, password)
      }

      const response = await loginWithEmail(email, password)

      login(response.access_token)

      navigate("/", {
        replace: true,
      })
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError(
          isRegister
            ? "Пользователь с таким email уже существует"
            : "Неверный email или пароль"
        )
      } else {
        setError("Ошибка соединения с сервером")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-90px)] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl">
            {isRegister ? "Создать аккаунт" : "Добро пожаловать"}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {isRegister
              ? "Начните учить быстрее с Recall"
              : "Войдите, чтобы продолжить обучение"}
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button disabled={loading} className="w-full">
            {loading
              ? "Загрузка..."
              : isRegister
                ? "Зарегистрироваться"
                : "Войти"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">или</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {isRegister ? (
          <Link
            to="/login"
            className="mt-4 block text-center text-xs text-muted-foreground hover:underline"
          >
            Уже есть аккаунт? Войти
          </Link>
        ) : (
          <Link
            to="/register"
            className="mt-4 block text-center text-xs text-muted-foreground hover:underline"
          >
            Нет аккаунта? Зарегистрироваться
          </Link>
        )}
      </div>
    </main>
  )
}
