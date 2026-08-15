import { useEffect, useState } from "react"
import { getAdminCardsStats } from "@/shared/api/admin"
import type { AdminCardsStats } from "@/shared/api/types"

export function AdminAnalyticsTab() {
  const [stats, setStats] = useState<AdminCardsStats | null>(null)

  useEffect(() => {
    getAdminCardsStats().then(setStats)
  }, [])

  if (!stats) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Stat name="Карточки" value={stats.total_cards} />

      <Stat name="Колоды" value={stats.total_decks} />

      <Stat name="Создано сегодня" value={stats.created_today} />

      <Stat name="Повторений сегодня" value={stats.reviews_today} />
    </div>
  )
}

function Stat({ name, value }: { name: string; value: number }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm text-muted-foreground">{name}</div>

      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
