import { apiClient } from "./client"
import type { ReviewCardsResponse, DecksResponse } from "./types"

export async function getReviewCards({
  deckId,
  limit,
}: { deckId?: number; limit?: number } = {}) {
  const res = await apiClient.get<ReviewCardsResponse>("/api/v1/review/cards", {
    params: {
      ...(deckId !== undefined && { deck_id: deckId }),
      limit,
    },
  })

  return res.data
}

export async function reviewCard(cardId: number, rating: number) {
  const res = await apiClient.post(`/api/v1/review/cards/${cardId}`, {
    rating,
  })

  return res.data
}

export async function getReviewDecks() {
  const res = await apiClient.get<DecksResponse>(`/api/v1/review/decks`)
  return res.data
}
