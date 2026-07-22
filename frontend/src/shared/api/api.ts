import axios from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Types ---
export type OAuthProvider = "google"

export interface OAuthProviderConfig {
  id: OAuthProvider
  label: string
}

export const oauthProviders: OAuthProviderConfig[] = [{ id: "google", label: "Google" }]

export interface User {
  id: string
  email: string
  is_active: boolean
  is_superuser?: boolean
  is_verified?: boolean
}

export interface Deck {
  id: number
  user_id: string
  title: string
  created_at?: string
  updated_at?: string
}

export interface DeckCard {
  id: number
  user_id: string
  deck_id: number | null
  front: string
  back: string
  created_at?: string
  updated_at?: string
  next_review?: string
  ease_factor?: number
  interval?: number
  reviews_count?: number
}

export interface DeckDetail extends Deck {
  cards: DeckCard[]
}

export interface Card {
  id: number
  user_id: string
  deck_id: number | null
  front: string
  back: string
}

export interface DecksResponse {
  decks: Deck[]
  total: number
}

// --- Auth API ---
export async function loginWithEmail(username: string, password: string) {
  const params = new URLSearchParams()
  params.append("username", username)
  params.append("password", password)

  const res = await apiClient.post<{ access_token: string }>("/api/v1/auth/jwt/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
  return res.data
}

export async function registerWithEmail(email: string, password: string) {
  const res = await apiClient.post<User>("/api/v1/auth/auth/register", {
    email,
    password,
  })
  return res.data
}

export async function logout() {
  try {
    await apiClient.post("/api/v1/auth/jwt/logout")
  } finally {
    localStorage.removeItem("token")
  }
}

export async function getOAuthUrl(provider: OAuthProvider): Promise<string> {
  const res = await apiClient.get<{ authorization_url: string }>(`/api/v1/auth/${provider}/authorize`)
  return res.data.authorization_url
}

export async function exchangeOAuthCode(
  provider: OAuthProvider,
  code: string,
  state: string,
): Promise<string> {
  const res = await apiClient.get<{ access_token: string }>(`/api/v1/auth/${provider}/callback`, {
    params: { code, state },
  })
  return res.data.access_token
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiClient.get<User>("/api/v1/auth/me")
  return res.data
}

// --- Decks API ---
export async function getDecks() {
  const res = await apiClient.get<DecksResponse>("/api/v1/decks/")
  return res.data
}

export async function getDeck(deckId: number) {
  const res = await apiClient.get<DeckDetail>(`/api/v1/decks/${deckId}`)
  return res.data
}

export async function createDeck(title: string) {
  const res = await apiClient.post<Deck>("/api/v1/decks/", { title })
  return res.data
}

export async function updateDeck(deckId: number, title: string) {
  const res = await apiClient.patch<Deck>(`/api/v1/decks/${deckId}`, { title })
  return res.data
}

export async function deleteDeck(deckId: number) {
  const res = await apiClient.delete(`/api/v1/decks/${deckId}`)
  return res.data
}

// --- Cards API ---
export async function createCard(deckId: number, front: string, back: string) {
  const res = await apiClient.post<Card>("/api/v1/cards/", {
    deck_id: deckId,
    front,
    back,
  })
  return res.data
}

export async function getCard(cardId: number) {
  const res = await apiClient.get<Card>(`/api/v1/cards/${cardId}`)
  return res.data
}

export async function updateCard(cardId: number, front: string, back: string) {
  const res = await apiClient.patch<Card>(`/api/v1/cards/${cardId}`, {
    front,
    back,
  })
  return res.data
}

export async function deleteCard(cardId: number) {
  const res = await apiClient.delete(`/api/v1/cards/${cardId}`)
  return res.data
}

export interface DueCardsResponse {
  cards: Card[]
  total: number
}

// --- Review API ---
export async function getDueCards(deckId?: number, limit = 10) {
  const res = await apiClient.get<DueCardsResponse>("/api/v1/cards/due", {
    params: {
      ...(deckId !== undefined && { deck_id: deckId }),
      limit,
    },
  })

  return res.data
}

export async function reviewCard(cardId: number, rating: number) {
  const res = await apiClient.post(`/api/v1/cards/${cardId}/review`, { rating })
  return res.data
}
