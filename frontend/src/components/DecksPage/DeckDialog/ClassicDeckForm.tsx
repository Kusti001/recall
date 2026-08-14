import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"

interface Props {
  title: string
  loading: boolean
  onTitleChange: (title: string) => void
  onCancel: () => void
  onSubmit: () => void
}

export function ClassicDeckForm({
  title,
  loading,
  onTitleChange,
  onCancel,
  onSubmit,
}: Props) {
  const { t } = useTranslation("decks")

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="deck-title">{t("deck_dialog.classic.title_label")}</Label>
        <Input
          id="deck-title"
          placeholder={t("deck_dialog.classic.title_placeholder")}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          {t("deck_dialog.buttons.cancel")}
        </Button>
        <Button disabled={!title.trim() || loading} onClick={onSubmit}>
          {loading ? t("deck_dialog.buttons.creating") : t("deck_dialog.buttons.create")}
        </Button>
      </DialogFooter>
    </>
  )
}
