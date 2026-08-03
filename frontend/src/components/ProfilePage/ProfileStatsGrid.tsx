import type { ProfileStats } from "@/shared/api/types"

interface Props {
  stats: ProfileStats
}

export function ProfileStatsGrid({ stats }: Props) {
  const items = [
    {
      label: "Карточек на изучении",
      value: stats.cards_studied,
    },
    {
      label: "Удержание за 30 дней",
      value: `${stats.retention_30d}%`,
    },
    {
      label: "Сегодня к повторению",
      value: stats.due_today,
    },
    {
      label: "Средний интервал",
      value: stats.average_interval,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border bg-background p-5">
          <p className="text-sm text-muted-foreground">{item.label}</p>

          <p className="mt-2 text-3xl font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
