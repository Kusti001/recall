export interface DeckStats {
  id: number
  title: string
  total_cards: number
  mastered_cards: number
  due_cards: number
}

export interface DecksResponse {
  decks: DeckStats[]
  total_decks: number
  total_due: number
}
export type CardStatus = "new" | "learning" | "mastered"

export interface CardListItem {
  id: number
  front: string
  front_description: string
  back: string
  back_description: string
  next_review: string
  status: CardStatus
  success_streak: number
  total_reviews: number
}

export interface DeckCardsResponse {
  cards: CardListItem[]
  total_cards: number
}

export interface ReviewCard {
  id: number
  front: string
  front_description: string
  back: string
  back_description: string
}

export interface ReviewCardsResponse {
  cards: ReviewCard[]
  total_cards: number
}

export interface CardDetail {
  id: number
  front: string
  front_description: string
  back: string
  back_description: string
  status: CardStatus
  next_review: string
  interval: number
  ease_factor: number
  success_streak: number
  total_reviews: number
}

export interface HeatmapDay {
  date: string
  count: number
}

export interface ProfileStats {
  display_name: string
  created_at: string
  retention_30d: number
  current_streak: number
  cards_studied: number
  due_today: number
  average_interval: number
  heatmap: HeatmapDay[]
}

export interface UpdateCardData {
  id: number
  front: string
  frontDescription: string
  back: string
  backDescription: string
}

export interface FeedbackItem {
  id: number
  user_id: number
  message: string
  created_at: string
}

export interface GenerateDeckRequest {
  prompt: string
  card_count: number
}

export interface GeneratedCard {
  front: string
  front_description: string | null
  back: string
  back_description: string | null
}

export interface GeneratedDeck {
  title: string
  cards: GeneratedCard[]
}

export interface ExportCard {
  front: string
  front_description: string | null
  back: string
  back_description: string | null
}

export interface ExportDeckData {
  title: string
  cards: ExportCard[]
}

export interface ImportDeckRequest {
  type: "recall"
  version: 1
  deck: ExportDeckData
}
