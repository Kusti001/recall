import { apiClient } from "./client"
import type { CardDetail } from "./types"

export async function createCard(front: string, back: string, deck_id: number) {
  const res = await apiClient.post<CardDetail>("/v1/cards", {
    front,
    back,
    deck_id,
  })

  return res.data
}

export async function getCardDetail(card_id: number) {
  const res = await apiClient.get<CardDetail>(`/v1/cards/${card_id}`)
  return res.data
}

export async function updateCard(card_id: number, front: string, back: string) {
  const res = await apiClient.patch<CardDetail>(`/v1/cards/${card_id}`, {
    front,
    back,
  })

  return res.data
}

export async function deleteCard(card_id: number) {
  const res = await apiClient.delete(`/v1/cards/${card_id}`)
  return res.data
}
