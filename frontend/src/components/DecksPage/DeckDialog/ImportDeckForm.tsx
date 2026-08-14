import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"

interface Props {
  file: File | null
  error: string | null
  loading: boolean
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onCancel: () => void
  onSubmit: () => void
}

export function ImportDeckForm({
  file,
  error,
  loading,
  onFileChange,
  onCancel,
  onSubmit,
}: Props) {
  const { t } = useTranslation("decks")

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="deck-file">{t("deck_dialog.import.file_label")}</Label>
          <Input
            id="deck-file"
            type="file"
            accept=".json,application/json"
            onChange={onFileChange}
            disabled={loading}
          />
        </div>

        {file && (
          <p className="text-sm text-muted-foreground">
            {t("deck_dialog.import.selected_file")}{" "}
            <span className="font-medium">{file.name}</span>
          </p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          {t("deck_dialog.buttons.cancel")}
        </Button>
        <Button onClick={onSubmit} disabled={!file || loading}>
          {loading ? t("deck_dialog.buttons.verifying") : t("deck_dialog.buttons.verify")}
        </Button>
      </DialogFooter>
    </>
  )
}
