// src/components/ErrorPage.tsx
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom"

export function ErrorPage() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? error.status === 404
      ? "Страница не найдена"
      : `Ошибка ${error.status}`
    : "Что-то пошло не так"

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 px-8 text-center">
      <h1 className="font-serif text-4xl">{message}</h1>
      <p className="text-muted-foreground">
        Попробуйте вернуться на главную или обновить страницу.
      </p>
      <Link to="/" className="text-sm underline">
        На главную
      </Link>
    </main>
  )
}
