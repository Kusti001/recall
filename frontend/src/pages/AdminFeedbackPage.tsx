import { useEffect, useState } from "react"
import { getFeedback } from "@/shared/api/feedback"
import type { FeedbackItem } from "@/shared/api/types"

export function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeedback()
      .then(setFeedback)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">Загрузка...</div>

  return (
    <main className="mx-auto max-w-3xl px-8 py-16">
      <h1 className="mb-8 font-serif text-3xl">Обратная связь</h1>
      <div className="space-y-4">
        {feedback.map((f) => (
          <div key={f.id} className="rounded-xl border p-4">
            <p>{f.message}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(f.created_at).toLocaleString("ru-RU")}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
