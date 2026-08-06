import type { ProfileStats } from "@/shared/api/types"
import { useTranslation } from "react-i18next"
interface Props {
  stats: ProfileStats
}

export function ProfileStatsGrid({ stats }: Props) {
  const { t } = useTranslation("profile")
  const items = [
    {
      label: t("stats.cards_studied"),
      value: stats.cards_studied,
    },
    {
      label: t("stats.retention_30d"),
      value: t("common.percent", { value: stats.retention_30d }),
    },
    {
      label: t("stats.due_today"),
      value: stats.due_today,
    },
    {
      label: t("stats.average_interval"),
      value: t("common.days_short", { value: stats.average_interval }),
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
