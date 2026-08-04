import { apiClient } from "./client"
import type { FeedbackItem } from "./types"

export async function submitFeedback(message: string) {
  const res = await apiClient.post("/v1/feedback", { message })
  return res.data
}

export async function getFeedback(): Promise<FeedbackItem[]> {
  const res = await apiClient.get("/v1/admin/feedback")
  return res.data
}
