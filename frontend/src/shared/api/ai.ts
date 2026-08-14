import { apiClient } from "./client"
import type { GenerateDeckRequest, GeneratedDeck } from "./types"

export async function generateDeck(
  data: GenerateDeckRequest
): Promise<GeneratedDeck> {
  const res = await apiClient.post("/v1/decks/generate", data)
  return res.data
}
