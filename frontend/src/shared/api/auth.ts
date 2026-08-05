import { apiClient } from "./client"

export interface User {
  id: string
  email: string
}

// --- Auth API ---
export async function loginWithEmail(username: string, password: string) {
  const params = new URLSearchParams()
  params.append("username", username)
  params.append("password", password)
  const res = await apiClient.post<{ access_token: string }>(
    "/v1/auth/jwt/login",
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  )
  return res.data
}

export async function registerWithEmail(email: string, password: string) {
  const res = await apiClient.post<User>("/v1/auth/register", {
    email,
    password,
  })
  return res.data
}

export async function logout() {
  await apiClient.post("/v1/auth/jwt/logout")
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiClient.get<User>("/v1/auth/users/me")
  return res.data
}

export async function updateEmail(email: string): Promise<User> {
  const res = await apiClient.patch<User>("/v1/auth/users/me", { email })
  return res.data
}

export async function updatePassword(password: string): Promise<User> {
  const res = await apiClient.patch<User>("/v1/auth/users/me", { password })
  return res.data
}
