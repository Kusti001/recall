import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
interface HeatmapDay {
  date: string
  count: number
}

interface Props {
  data: HeatmapDay[]
}

function getLevel(count: number) {
  if (count === 0) return "bg-muted"
  if (count < 5) return "bg-emerald-950"
  if (count < 15) return "bg-emerald-800"
  if (count < 30) return "bg-emerald-600"

  return "bg-emerald-400"
}

function formatDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function ActivityHeatmap({ data }: Props) {
  const { t, i18n } = useTranslation("profile")
  const [hovered, setHovered] = useState<{
    day: HeatmapDay
    x: number
    y: number
  } | null>(null)

  const weeks = useMemo(() => {
    const dataMap = new Map(data.map((d) => [d.date, d.count]))

    const today = new Date()

    const start = new Date(today)
    start.setDate(today.getDate() - 181)

    start.setDate(start.getDate() - start.getDay())

    const days: HeatmapDay[] = []

    const cursor = new Date(start)

    while (cursor <= today) {
      const iso = cursor.toISOString().split("T")[0]

      days.push({
        date: iso,
        count: dataMap.get(iso) ?? 0,
      })

      cursor.setDate(cursor.getDate() + 1)
    }

    const result: HeatmapDay[][] = []

    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7))
    }

    return result
  }, [data])

  return (
    <div className="relative rounded-xl border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{t("activity.title")}</h2>

        <span className="text-sm text-muted-foreground">
          {t("activity.period", { days: 182 })}
        </span>
      </div>

      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                className={`h-3.5 w-3.5 rounded-xs ${getLevel(day.count)} transition-all hover:ring-1 hover:ring-foreground/40`}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()

                  const parent = e.currentTarget
                    .closest(".relative")!
                    .getBoundingClientRect()

                  setHovered({
                    day,
                    x: rect.left - parent.left + rect.width / 2,
                    y: rect.top - parent.top,
                  })
                }}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <span>{t("activity.less")}</span>

        <div className="h-3 w-3 rounded-xs bg-muted" />
        <div className="h-3 w-3 rounded-xs bg-emerald-950" />
        <div className="h-3 w-3 rounded-xs bg-emerald-800" />
        <div className="h-3 w-3 rounded-xs bg-emerald-600" />
        <div className="h-3 w-3 rounded-xs bg-emerald-400" />

        <span>{t("activity.more")}</span>
      </div>

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: hovered.x,
            top: hovered.y - 6,
          }}
        >
          <div className="font-medium">
            {formatDate(hovered.day.date, i18n.language)}
          </div>

          <div className="text-muted-foreground">
            {hovered.day.count === 0
              ? t("activity.no_reviews")
              : t("activity.reviews", {
                  count: hovered.day.count,
                })}
          </div>
        </div>
      )}
    </div>
  )
}
