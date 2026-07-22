import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  getOAuthUrl,
  loginWithEmail,
  registerWithEmail,
  oauthProviders,
  type OAuthProvider,
} from "@/shared/api/api"

export function LoginPage() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setOauthLoading(provider)
    try {
      const url = await getOAuthUrl(provider)
      window.location.href = url
    } catch (err: any) {
      setError("Ошибка OAuth соединения")
      setOauthLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isRegister) {
        await registerWithEmail(email, password)
        // Автоматически логиним после успещной регистрации
        const loginRes = await loginWithEmail(email, password)
        localStorage.setItem("token", loginRes.access_token)
      } else {
        const res = await loginWithEmail(email, password)
        localStorage.setItem("token", res.access_token)
      }
      navigate("/", { replace: true })
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(isRegister ? "Пользователь уже существует" : "Неверный логин или пароль")
      } else {
        setError("Ошибка при запросе к серверу")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-sm">
        <h2 className="mb-2 text-center text-2xl font-semibold">
          {isRegister ? "Регистрация" : "Вход в аккаунт"}
        </h2>

        <p className="mb-6 text-center text-sm text-muted-foreground">
          {isRegister ? "Создайте новый профиль" : "Выберите способ входа"}
        </p>

        {error && (
          <div className="mb-4 rounded border border-destructive/20 bg-destructive/10 p-3 text-center text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full py-2">
            {loading ? "Загрузка..." : isRegister ? "Зарегистрироваться" : "Войти"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">или</span>
          </div>
        </div>

        <div className="space-y-2">
          {oauthProviders.map((provider) => (
            <Button
              key={provider.id}
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin(provider.id)}
              disabled={oauthLoading !== null}
              className="w-full py-2 font-medium"
            >
              {oauthLoading === provider.id
                ? "Загрузка..."
                : `Продолжить через ${provider.label}`}
            </Button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:underline"
        >
          {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </button>
      </div>
    </div>
  )
}
