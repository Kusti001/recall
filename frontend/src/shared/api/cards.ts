import { apiClient } from "./client"
import type { CardDetail } from "./types"

export async function createCard({
  deck_id,
  front,
  back,
  front_description,
  back_description,
}: {
  deck_id: number
  front: string
  back: string
  front_description: string
  back_description: string
}) {
  const res = await apiClient.post<CardDetail>("/v1/cards", {
    deck_id,
    front,
    back,
    front_description,
    back_description,
  })

  return res.data
}

export async function getCardDetail(card_id: number) {
  const res = await apiClient.get<CardDetail>(`/v1/cards/${card_id}`)
  return res.data
}

export async function updateCard({
  card_id,
  front,
  back,
  front_description,
  back_description,
}: {
  card_id: number
  front: string
  back: string
  front_description: string
  back_description: string
}) {
  const res = await apiClient.patch<CardDetail>(`/v1/cards/${card_id}`, {
    front,
    back,
    front_description,
    back_description,
  })

  return res.data
}

export async function deleteCard(card_id: number) {
  const res = await apiClient.delete(`/v1/cards/${card_id}`)
  return res.data
}
