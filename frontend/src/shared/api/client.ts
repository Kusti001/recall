import axios from "axios"

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      unauthorizedHandler?.()
    }

    return Promise.reject(error)
  }
)
