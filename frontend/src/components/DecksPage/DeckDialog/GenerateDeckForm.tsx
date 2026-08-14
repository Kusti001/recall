import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"

interface Props {
  prompt: string
  cardCount: number
  loading: boolean
  onPromptChange: (prompt: string) => void
  onCardCountChange: (count: number) => void
  onCancel: () => void
  onSubmit: () => void
}

export function GenerateDeckForm({
  prompt,
  cardCount,
  loading,
  onPromptChange,
  onCardCountChange,
  onCancel,
  onSubmit,
}: Props) {
  const { t } = useTranslation("decks")

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="deck-prompt">{t("deck_dialog.generate.prompt_label")}</Label>
          <Textarea
            id="deck-prompt"
            placeholder={t("deck_dialog.generate.prompt_placeholder")}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            disabled={loading}
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="card-count">{t("deck_dialog.generate.card_count_label")}</Label>
          <Input
            id="card-count"
            type="number"
            min={1}
            max={20}
            value={cardCount}
            onChange={(e) => onCardCountChange(Number(e.target.value))}
            disabled={loading}
            className="w-24"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          {t("deck_dialog.buttons.cancel")}
        </Button>
        <Button onClick={onSubmit} disabled={!prompt.trim() || loading}>
          {loading ? t("deck_dialog.buttons.generating") : t("deck_dialog.buttons.generate")}
        </Button>
      </DialogFooter>
    </>
  )
}
