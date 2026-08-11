import type { CardStatus } from "@/shared/api/types"

const STATUS_STYLES: Record<CardStatus, string> = {
  new: "bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20",
  learning:
    "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
  mastered:
    "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
}

const STATUS_LABELS: Record<CardStatus, string> = {
  new: "Новая",
  learning: "Изучается",
  mastered: "Выучена",
}

export function StatusBadge({ status }: { status: CardStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
