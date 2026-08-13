import { apiClient } from "./client"
import type {} from "./types"

export async function exportDeck(deckId: number, format: string) {
  const res = await apiClient.get(`/v1/decks/${deckId}/export`, {
    params: { format },
  })

  return res.data
}
