import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import type { GeneratedCard, GeneratedDeck } from "@/shared/api/types"

interface Props {
  deck: GeneratedDeck
  editingCardIndex: number | null
  loading: boolean
  onDeckChange: (updater: (deck: GeneratedDeck) => GeneratedDeck) => void
  onCardChange: (
    index: number,
    updater: (card: GeneratedCard) => GeneratedCard
  ) => void
  onEditingCardChange: (index: number | null) => void
  onDeleteCard: (index: number) => void
  onBack: () => void
  onSubmit: () => void
}

export function DeckPreviewEditor({
  deck,
  editingCardIndex,
  loading,
  onDeckChange,
  onCardChange,
  onEditingCardChange,
  onDeleteCard,
  onBack,
  onSubmit,
}: Props) {
  const { t } = useTranslation("decks")

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="preview-deck-title">{t("deck_dialog.preview.title_label")}</Label>
        <Input
          id="preview-deck-title"
          value={deck.title}
          onChange={(e) =>
            onDeckChange((deck) => ({
              ...deck,
              title: e.target.value,
            }))
          }
          className="font-medium"
        />
        <p className="text-sm text-muted-foreground">
          {t("deck_dialog.preview.cards_count", { count: deck.cards.length })}
        </p>
      </div>

      <div className="space-y-3">
        {deck.cards.map((card, index) => (
          <PreviewCard
            key={index}
            card={card}
            editing={editingCardIndex === index}
            onChange={(updater) => onCardChange(index, updater)}
            onEdit={() => onEditingCardChange(index)}
            onDone={() => onEditingCardChange(null)}
            onDelete={() => onDeleteCard(index)}
          />
        ))}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onBack} disabled={loading}>
          {t("deck_dialog.buttons.back")}
        </Button>
        <Button
          onClick={onSubmit}
          disabled={deck.cards.length === 0 || loading}
        >
          {loading ? t("deck_dialog.buttons.creating") : t("deck_dialog.buttons.create_deck")}
        </Button>
      </DialogFooter>
    </>
  )
}

interface PreviewCardProps {
  card: GeneratedCard
  editing: boolean
  onChange: (updater: (card: GeneratedCard) => GeneratedCard) => void
  onEdit: () => void
  onDone: () => void
  onDelete: () => void
}

function PreviewCard({
  card,
  editing,
  onChange,
  onEdit,
  onDone,
  onDelete,
}: PreviewCardProps) {
  const { t } = useTranslation("decks")

  if (editing) {
    return (
      <div className="rounded-lg border p-4">
        <div className="space-y-3">
          <PreviewCardTextField
            label={t("deck_dialog.preview.card.front")}
            value={card.front}
            minHeight="min-h-20"
            onChange={(front) => onChange((card) => ({ ...card, front }))}
          />

          <PreviewCardTextField
            label={t("deck_dialog.preview.card.hint")}
            value={card.front_description ?? ""}
            placeholder={t("deck_dialog.preview.card.optional_placeholder")}
            minHeight="min-h-16"
            onChange={(frontDescription) =>
              onChange((card) => ({
                ...card,
                front_description: frontDescription || null,
              }))
            }
          />

          <PreviewCardTextField
            label={t("deck_dialog.preview.card.back")}
            value={card.back}
            minHeight="min-h-20"
            onChange={(back) => onChange((card) => ({ ...card, back }))}
          />

          <PreviewCardTextField
            label={t("deck_dialog.preview.card.explanation")}
            value={card.back_description ?? ""}
            placeholder={t("deck_dialog.preview.card.optional_placeholder")}
            minHeight="min-h-16"
            onChange={(backDescription) =>
              onChange((card) => ({
                ...card,
                back_description: backDescription || null,
              }))
            }
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onDelete}>
              {t("deck_dialog.buttons.delete")}
            </Button>
            <Button size="sm" onClick={onDone}>
              {t("deck_dialog.buttons.done")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-medium">{card.front}</p>
            {card.front_description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {card.front_description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            {t("deck_dialog.buttons.edit")}
          </Button>
        </div>

        <div className="h-px bg-border" />

        <div>
          <p className="text-sm">{card.back}</p>
          {card.back_description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {card.back_description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

interface PreviewCardTextFieldProps {
  label: string
  value: string
  minHeight: string
  placeholder?: string
  onChange: (value: string) => void
}

function PreviewCardTextField({
  label,
  value,
  minHeight,
  placeholder,
  onChange,
}: PreviewCardTextFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={minHeight}
      />
    </div>
  )
}
