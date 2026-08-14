import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface Props {
  totalDecks: number
  totalDue: number
  onCreate: () => void
}

export function DecksHeader({ totalDecks, totalDue, onCreate }: Props) {
  const { t } = useTranslation("decks")
  return (
    <div className="flex items-end justify-between">
      <div>
        <h1 className="font-serif text-4xl">{t("decks")}</h1>

        <p className="mt-2 text-muted-foreground">
          {t("stats", { count: totalDecks, cards: totalDue })}
        </p>
      </div>

      <Button onClick={onCreate}>{t("create_deck")}</Button>
    </div>
  )
}
