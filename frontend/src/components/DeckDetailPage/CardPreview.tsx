import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

import type { CardDetail } from "@/shared/api/api"
import { StatusBadge } from "./StatusBadge"

interface CardPreviewProps {
  card: CardDetail
  onEdit: () => void
  onDelete: () => void
}

export function CardPreview({ card, onEdit, onDelete }: CardPreviewProps) {
  const { t } = useTranslation("deck_detail")
  return (
    <aside className="rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase">
          {t("card_preview")}
        </p>
        <StatusBadge status={card.status} />
      </div>

      <h2 className="mt-4 font-serif text-xl">{card.front}</h2>
      {card.front_description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {card.front_description}
        </p>
      )}

      <div className="my-5 h-px w-12 bg-border" />

      <p className="text-muted-foreground">{card.back}</p>
      {card.back_description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {card.back_description}
        </p>
      )}

      <div className="mt-8 border-t pt-6">
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">{t("interval")}</p>
            <p>{t("days", { count: card.interval })}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("next_review")}</p>
            <p>{new Date(card.next_review).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("total_reviews")}</p>
            <p>{card.total_reviews}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("ease_factor")}</p>
            <p>{card.ease_factor.toFixed(2)}</p>
          </div>
        </div>

        {card.success_streak > 0 && (
          <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>{t("success_streak", { count: card.success_streak })} </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex w-full gap-3">
        <Button variant="outline" className="flex-1" onClick={onEdit}>
          {t("edit")}
        </Button>
        <Button variant="destructive" className="flex-1" onClick={onDelete}>
          {t("delete")}
        </Button>
      </div>
    </aside>
  )
}
