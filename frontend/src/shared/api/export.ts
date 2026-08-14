import { apiClient } from "./client"
import type { GeneratedDeck, ImportDeckRequest } from "./types"

export async function exportDeck(deckId: number, format: string) {
  const res = await apiClient.get(`/v1/decks/${deckId}/export`, {
    params: { format },
  })

  return res.data
}

export async function importDeck(data: ImportDeckRequest) {
  const res = await apiClient.post("/v1/decks/import", data)
  return res.data
}

export async function previewImportDeck(
  data: ImportDeckRequest
): Promise<GeneratedDeck> {
  const res = await apiClient.post("/v1/decks/import/preview", data)
  return res.data
}

export async function importDeckFromFile(file: File) {
  const text = await file.text()

  const data: ImportDeckRequest = JSON.parse(text)

  return importDeck(data)
}

export async function previewImportDeckFromFile(
  file: File
): Promise<GeneratedDeck> {
  const text = await file.text()

  const data: ImportDeckRequest = JSON.parse(text)

  return previewImportDeck(data)
}
