import axios from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    // send as Bearer token
    // axios types: headers may be undefined, ensure object exists
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

// --- Types ---
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

// --- Decks API ---
export interface DeckStats {
  id: number
  title: string
  total_cards: number
  mastered: number
  due: number
}

export interface DecksResponse {
  decks: DeckStats[]
  total_decks: number
  total_due: number
}

export interface DeckCreate {
  title: string
}

export interface DeckDetail {
  id: number
  title: string
  total_cards: number
  mastered_cards: number
  due_cards: number
}

export interface CardListItem {
  id: number
  front: string
  back: string
  interval: number
  status: string
  reviews: number
}

export interface DeckCardsResponse {
  cards: CardListItem[]
  total: number
}

export interface CardDetail {
  id: number
  front: string
  back: string
  next_review: string
  interval: number
  ease_factor: number
  reviews_count: number
}

export async function updateCard(card_id:number, front: string, back: string) {
  const res = await apiClient.patch<CardDetail>(`/api/v1/cards/${card_id}`, {
    front,
    back,
  })

  return res.data
}

export async function createCard(front: string, back: string, deck_id: number) {
  const res = await apiClient.post<CardDetail>("/api/v1/cards/", {
    front,
    back,
    deck_id,
  })

  return res.data
}

export async function getDecks() {
  const res = await apiClient.get<DecksResponse>("/api/v1/decks/")
  return res.data
}

export async function getDeckDetail(deck_id: number) {
  const res = await apiClient.get<DeckDetail>(`/api/v1/decks/${deck_id}`)
  return res.data
}

export async function getDeckCards(deck_id: number) {
  const res = await apiClient.get<DeckCardsResponse>(
    `/api/v1/decks/${deck_id}/cards`
  )
  return res.data
}

export async function getCardDetail(card_id: number) {
  const res = await apiClient.get<CardDetail>(`/api/v1/cards/${card_id}`)
  return res.data
}

export async function createDeck(title: string) {
  const res = await apiClient.post<DeckCreate>("/api/v1/decks/", { title })
  return res.data
}


/*export async function updateDeck(deckId: number, title: string) {
  const res = await apiClient.patch<Deck>(`/api/v1/decks/${deckId}`, { title })
  return res.data
} */

export async function deleteDeck(deck_id: number) {
  const res = await apiClient.delete(`/api/v1/decks/${deck_id}`)
  return res.data
}

export async function deleteCard(card_id: number) {
  const res = await apiClient.delete(`/api/v1/cards/${card_id}`)
  return res.data
}
/*
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
*/
