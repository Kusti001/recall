import { useEffect, useState } from "react"
import { getAdminFeedback } from "@/shared/api/admin"
import type { FeedbackItem } from "@/shared/api/types"

export function AdminFeedbackTab() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminFeedback()
      .then(setFeedback)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
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
  )
}
