import { apiClient } from "./client"
import type { AdminCardsStats, AdminUserStats, FeedbackItem } from "./types"

export async function submitFeedback(message: string) {
  const res = await apiClient.post("/v1/admin/feedback", { message })
  return res.data
}

export async function getAdminUserStats() {
  const res = await apiClient.get<AdminUserStats>("/v1/admin/stats/users")

  return res.data
}

export async function getAdminCardsStats() {
  const res = await apiClient.get<AdminCardsStats>("/v1/admin/stats/cards")

  return res.data
}

export async function getAdminFeedback() {
  const res = await apiClient.get<FeedbackItem[]>("/v1/admin/feedback")

  return res.data
}
