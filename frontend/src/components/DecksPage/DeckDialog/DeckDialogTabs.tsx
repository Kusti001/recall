import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

export type DeckDialogTab = "classic" | "import" | "generate"

interface Props {
  value: DeckDialogTab
  disabled: boolean
  onChange: (value: DeckDialogTab) => void
}

export function DeckDialogTabs({ value, disabled, onChange }: Props) {
  const { t, i18n } = useTranslation("decks")

  console.log(i18n.language)
  console.log(t("deck_dialog.tabs.classic"))
  console.log(t("deck_dialog"))

  const tabs: Array<{ value: DeckDialogTab; label: string }> = [
    { value: "classic", label: t("deck_dialog.tabs.classic") },
    { value: "import", label: t("deck_dialog.tabs.import") },
    { value: "generate", label: t("deck_dialog.tabs.generate") },
  ]

  return (
    <div className="grid grid-cols-3 rounded-md border bg-muted p-1">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          type="button"
          variant={value === tab.value ? "secondary" : "ghost"}
          onClick={() => onChange(tab.value)}
          disabled={disabled}
          className="min-w-0"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
