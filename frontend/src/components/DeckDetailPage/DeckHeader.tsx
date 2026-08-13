import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Pencil, Trash2, Download } from "lucide-react"
import { useTranslation } from "react-i18next"
import { exportDeck } from "@/shared/api/export"

interface DeckHeaderProps {
  title: string
  totalCards: number
  dueCards: number
  deckId: number
  onAddCard: () => void
  onEditDeck: () => void
  onDeleteDeck: () => void
}

async function handleExportDeck(deckId: number) {
  try {
    const data = await exportDeck(deckId, "json")

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    )

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `deck_${deckId}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error exporting deck:", error)
  }
}

export function DeckHeader({
  title,
  totalCards,
  dueCards,
  deckId,
  onAddCard,
  onDeleteDeck,
  onEditDeck,
}: DeckHeaderProps) {
  const { t } = useTranslation("deck_detail")
  return (
    <div className="pb-6">
      <div className="text-sm text-muted-foreground">{t("decks")} / {title}</div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("stats", { cards: totalCards, due: dueCards })}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExportDeck(deckId)}>
              <Download className="mr-2 h-4 w-4" />
              {t("export")}
            </Button>
            <Button variant="outline" size="sm" onClick={onEditDeck}>
              <Pencil className="mr-2 h-4 w-4" />
              {t("rename")}
            </Button>
            <Button variant="outline" size="sm" onClick={onDeleteDeck}>
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              {t("delete")}
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onAddCard}>
              {t("add_card")}
            </Button>
            <Link to={`/review/deck/${deckId}`}>
              <Button>{t("review")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
