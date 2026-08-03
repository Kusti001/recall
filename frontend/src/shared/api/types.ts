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
  total_cards: number
}

export interface ReviewCard {
  id: number
  front: string
  back: string
}

export interface ReviewCardsResponse {
  cards: ReviewCard[]
  total_cards: number
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
