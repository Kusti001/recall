import { apiClient } from "./client"

export type OAuthProvider = "google"

export interface OAuthProviderConfig {
  id: OAuthProvider
  label: string
}

export const oauthProviders: OAuthProviderConfig[] = [
  { id: "google", label: "Google" },
]

export interface User {
  id: string
  email: string
  is_active: boolean
  is_superuser?: boolean
  is_verified?: boolean
}

// --- Auth API ---
export async function loginWithEmail(username: string, password: string) {
  const params = new URLSearchParams()
  params.append("username", username)
  params.append("password", password)

  const res = await apiClient.post<{ access_token: string }>(
    "/api/v1/auth/jwt/login",
    params,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  )
  return res.data
}

export async function registerWithEmail(email: string, password: string) {
  const res = await apiClient.post<User>("/api/v1/auth/register", {
    email,
    password,
  })
  return res.data
}

export async function logout() {
    await apiClient.post("/api/v1/auth/jwt/logout")
}

export async function getOAuthUrl(provider: OAuthProvider): Promise<string> {
  const res = await apiClient.get<{ authorization_url: string }>(
    `/api/v1/auth/${provider}/authorize`
  )
  return res.data.authorization_url
}

export async function exchangeOAuthCode(
  provider: OAuthProvider,
  code: string,
  state: string
): Promise<string> {
  const res = await apiClient.get<{ access_token: string }>(
    `/api/v1/auth/${provider}/callback`,
    {
      params: { code, state },
    }
  )
  return res.data.access_token
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiClient.get<User>("/api/v1/auth/me")
  return res.data
}
