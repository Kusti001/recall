import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { createDeck } from "@/shared/api/api"
import { generateDeck } from "@/shared/api/ai"
import { importDeck, previewImportDeckFromFile } from "@/shared/api/export"
import type { GeneratedCard, GeneratedDeck } from "@/shared/api/types"

import { DeckDialogTabs, type DeckDialogTab } from "./DeckDialogTabs"
import { ClassicDeckForm } from "./ClassicDeckForm"
import { ImportDeckForm } from "./ImportDeckForm"
import { GenerateDeckForm } from "./GenerateDeckForm"
import { DeckPreviewEditor } from "./DeckPreviewEditor"

type DeckDialogStep = "form" | "preview"

interface Props {
  open: boolean
  onOpenChange: (value: boolean) => void
  onCreated: () => Promise<void>
}

export function DeckDialog({ open, onOpenChange, onCreated }: Props) {
  const { t } = useTranslation("decks")

  const [tab, setTab] = useState<DeckDialogTab>("classic")
  const [step, setStep] = useState<DeckDialogStep>("form")

  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [cardCount, setCardCount] = useState(10)

  const [previewDeck, setPreviewDeck] = useState<GeneratedDeck | null>(null)
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const isPreviewStep = step === "preview" && previewDeck

  async function handleCreateEmptyDeck() {
    if (!title.trim()) return

    setLoading(true)
    try {
      await createDeck(title.trim())
      await onCreated()
      closeDialog()
    } finally {
      setLoading(false)
    }
  }

  function handleImportFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null
    setImportError(null)

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (!selectedFile.name.endsWith(".json")) {
      setFile(null)
      setImportError(t("import.invalidFileError"))
      return
    }

    setFile(selectedFile)
  }

  async function handlePreviewImportDeck() {
    if (!file) return

    setLoading(true)
    setImportError(null)

    try {
      const deck = await previewImportDeckFromFile(file)
      openPreview(deck)
    } catch (error) {
      console.error(error)
      setImportError(t("import.importError"))
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateDeck() {
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const deck = await generateDeck({
        prompt: prompt.trim(),
        card_count: cardCount,
      })
      openPreview(deck)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreatePreviewDeck() {
    if (!previewDeck) return

    setLoading(true)
    try {
      await importDeck({
        type: "recall",
        version: 1,
        deck: previewDeck,
      })
      await onCreated()
      closeDialog()
    } finally {
      setLoading(false)
    }
  }

  function openPreview(deck: GeneratedDeck) {
    setPreviewDeck(deck)
    setEditingCardIndex(null)
    setStep("preview")
  }

  function closePreview() {
    setPreviewDeck(null)
    setEditingCardIndex(null)
    setStep("form")
  }

  function handleTabChange(nextTab: DeckDialogTab) {
    setTab(nextTab)
    closePreview()
  }

  function updatePreviewDeck(updater: (deck: GeneratedDeck) => GeneratedDeck) {
    setPreviewDeck((deck) => (deck ? updater(deck) : deck))
  }

  function updatePreviewCard(
    index: number,
    updater: (card: GeneratedCard) => GeneratedCard
  ) {
    updatePreviewDeck((deck) => ({
      ...deck,
      cards: deck.cards.map((card, cardIndex) =>
        cardIndex === index ? updater(card) : card
      ),
    }))
  }

  function deletePreviewCard(index: number) {
    updatePreviewDeck((deck) => ({
      ...deck,
      cards: deck.cards.filter((_, cardIndex) => cardIndex !== index),
    }))
    setEditingCardIndex(null)
  }

  function resetDialogState() {
    setTab("classic")
    setStep("form")
    setTitle("")
    setFile(null)
    setImportError(null)
    setPrompt("")
    setCardCount(10)
    setPreviewDeck(null)
    setEditingCardIndex(null)
    setLoading(false)
  }

  function closeDialog() {
    onOpenChange(false)
    setTimeout(resetDialogState, 200)
  }

  function handleClose() {
    if (loading) return
    closeDialog()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("deck_dialog.title")}</DialogTitle>
          <DialogDescription>{t("deck_dialog.description")}</DialogDescription>
        </DialogHeader>

        <DeckDialogTabs
          value={tab}
          onChange={handleTabChange}
          disabled={loading}
        />

        {tab === "classic" && (
          <ClassicDeckForm
            title={title}
            loading={loading}
            onTitleChange={setTitle}
            onCancel={handleClose}
            onSubmit={handleCreateEmptyDeck}
          />
        )}

        {tab === "import" && step === "form" && (
          <ImportDeckForm
            file={file}
            error={importError}
            loading={loading}
            onFileChange={handleImportFileChange}
            onCancel={handleClose}
            onSubmit={handlePreviewImportDeck}
          />
        )}

        {tab === "generate" && step === "form" && (
          <GenerateDeckForm
            prompt={prompt}
            cardCount={cardCount}
            loading={loading}
            onPromptChange={setPrompt}
            onCardCountChange={setCardCount}
            onCancel={handleClose}
            onSubmit={handleGenerateDeck}
          />
        )}

        {isPreviewStep && (
          <DeckPreviewEditor
            deck={previewDeck}
            editingCardIndex={editingCardIndex}
            loading={loading}
            onDeckChange={updatePreviewDeck}
            onCardChange={updatePreviewCard}
            onEditingCardChange={setEditingCardIndex}
            onDeleteCard={deletePreviewCard}
            onBack={closePreview}
            onSubmit={handleCreatePreviewDeck}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
