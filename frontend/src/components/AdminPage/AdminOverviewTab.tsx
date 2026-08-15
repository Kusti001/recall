import { useEffect, useState } from "react"
import { getAdminUserStats } from "@/shared/api/admin"
import type { AdminUserStats } from "@/shared/api/types"

export function AdminOverviewTab() {
  const [stats, setStats] = useState<AdminUserStats | null>(null)

  useEffect(() => {
    getAdminUserStats().then(setStats)
  }, [])

  if (!stats) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard title="Всего пользователей" value={stats.total_users} />

      <StatCard title="Сегодня активны" value={stats.active_today} />

      <StatCard title="За неделю активны" value={stats.active_this_week} />

      <StatCard title="Новые за неделю" value={stats.new_this_week} />
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-sm text-muted-foreground">{title}</p>

      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  )
}
