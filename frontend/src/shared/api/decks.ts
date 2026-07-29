import { apiClient } from "./client"
import type {
  DecksResponse,
  DeckStats,
  DeckCardsResponse,
} from "./types"

export async function getDecks() {
  const res = await apiClient.get<DecksResponse>("/api/v1/decks")
  return res.data
}

export async function getDeckStats(deck_id: number) {
  const res = await apiClient.get<DeckStats>(`/api/v1/decks/${deck_id}`)
  return res.data
}

export async function getDeckCards(deck_id: number) {
  const res = await apiClient.get<DeckCardsResponse>(
    `/api/v1/decks/${deck_id}/cards`
  )
  return res.data
}

export async function createDeck(title: string) {
  const res = await apiClient.post("/api/v1/decks", { title })
  return res.data
}

export async function updateDeck(deckId: number, title: string) {
  const res = await apiClient.patch<DeckStats>(`/api/v1/decks/${deckId}`, { title })
  return res.data
}

export async function deleteDeck(deck_id: number) {
  const res = await apiClient.delete(`/api/v1/decks/${deck_id}`)
  return res.data
}
