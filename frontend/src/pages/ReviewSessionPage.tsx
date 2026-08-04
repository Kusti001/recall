import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GradeBar } from "@/components/ReviewSessionPage/GradeBar"
import { ReviewCard as ReviewCardComponent } from "@/components/ReviewSessionPage/ReviewCard"
import { getReviewCards, reviewCard } from "@/shared/api/api"
import type { ReviewCard } from "@/shared/api/api"

export function ReviewSessionPage() {
  const { id } = useParams()
  const [cards, setCards] = useState<ReviewCard[]>([])
  const [current, setCurrent] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pressedGrade, setPressedGrade] = useState<number | null>(null)

  useEffect(() => {
    async function loadReviewCards() {
      try {
        setLoading(true)

        const response = await getReviewCards({
          deckId: id ? Number(id) : undefined,
        })

        setCards(response.cards)
        setCurrent(0)
        setShowAnswer(false)
      } catch (error) {
        console.error("Failed to load review cards:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReviewCards()
  }, [id])

  const card = cards[current]

  function handleFlip() {
    setShowAnswer((prev) => !prev)
  }

  async function handleGrade(grade: number) {
    if (!card) return
    await reviewCard(card.id, grade)
    setShowAnswer(false)
    setCurrent((prev) => prev + 1)
  }

  function triggerGrade(grade: number) {
    setPressedGrade(grade)
    window.setTimeout(() => {
      setPressedGrade(null)
      handleGrade(grade)
    }, 150)
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === "Space") {
        event.preventDefault()
        handleFlip()
        return
      }

      if (!showAnswer) return

      const key = Number(event.key)
      if (Number.isInteger(key) && key >= 0 && key <= 5) {
        event.preventDefault()
        triggerGrade(key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAnswer, current, cards])

  if (loading) {
    return (
      <main className="flex h-full items-center justify-center px-8">
        <p className="text-sm text-muted-foreground">Загрузка...</p>
      </main>
    )
  }

  if (cards.length === 0) {
    return (
      <main className="flex h-full items-center justify-center px-8">
        <p className="text-sm text-muted-foreground">
          Сегодня повторять нечего 🎉
        </p>
      </main>
    )
  }

  if (current >= cards.length) {
    return (
      <main className="flex h-full items-center justify-center px-8">
        <p className="text-sm text-muted-foreground">Сессия завершена 🎉</p>
      </main>
    )
  }

  return (
    <main className="flex h-full flex-col px-8 py-12">
      <div className="mx-auto flex w-full max-w-3xl justify-between text-sm text-muted-foreground">
        <span>
          {current + 1} / {cards.length}
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-3xl">
          <ReviewCardComponent
            card={card}
            revealed={showAnswer}
            onFlip={handleFlip}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <div
          className={`transition-all duration-200 ${
            showAnswer
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <GradeBar onGrade={triggerGrade} activeGrade={pressedGrade} />
        </div>
      </div>
    </main>
  )
}
