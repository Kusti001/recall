import type { ProfileStats } from "./types"
import { apiClient } from "./client"


export async function getProfileStats() {
  const res = await apiClient.get<ProfileStats>("/v1/profile/stats")
  return res.data
}
