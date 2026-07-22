import { useEffect, useState } from "react"
import { getDueCards, reviewCard, type Card } from "@/shared/api/api"
import { Button } from "@/components/ui/button"

export function ReviewPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await getDueCards(); // Получаем { cards: [...], total: N }
        setCards(data.cards);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  const handleReview = async (rating: number) => {
    const currentCard = cards[currentIndex]
    if (!currentCard) return

    try {
      await reviewCard(currentCard.id, rating)
      setShowAnswer(false)
      setCurrentIndex((prev) => prev + 1)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Загрузка карточек для повторения...</div>
  }

  const currentCard = cards[currentIndex]

  if (!currentCard || currentIndex >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
        <h2 className="text-xl font-bold">Отличная работа! 🎉</h2>
        <p className="text-sm text-muted-foreground">На сегодня нет доступных карточек для повторения.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg p-6 space-y-6">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Повторение карточек</span>
        <span>Осталось: {cards.length - currentIndex}</span>
      </div>

      <div className="border rounded-xl p-8 bg-background shadow-sm text-center space-y-6 min-h-[220px] flex flex-col justify-center items-center">
        <p className="text-lg font-medium">{currentCard.front}</p>

        {showAnswer && (
          <div className="w-full border-t pt-4 text-primary font-semibold">
            {currentCard.back}
          </div>
        )}
      </div>

      {!showAnswer ? (
        <Button onClick={() => setShowAnswer(true)} className="w-full py-3">
          Показать ответ
        </Button>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          <Button variant="outline" className="border-red-500/50 hover:bg-red-500/10" onClick={() => handleReview(0)}>
            0 · Провал
          </Button>
          <Button variant="outline" className="border-orange-500/50 hover:bg-orange-500/10" onClick={() => handleReview(1)}>
            1 · Плохо
          </Button>
          <Button variant="outline" className="border-amber-500/50 hover:bg-amber-500/10" onClick={() => handleReview(2)}>
            2 · Тяжело
          </Button>
          <Button variant="outline" className="border-yellow-500/50 hover:bg-yellow-500/10" onClick={() => handleReview(3)}>
            3 · Норм
          </Button>
          <Button variant="outline" className="border-blue-500/50 hover:bg-blue-500/10" onClick={() => handleReview(4)}>
            4 · Хорошо
          </Button>
          <Button variant="outline" className="border-emerald-500/50 hover:bg-emerald-500/10" onClick={() => handleReview(5)}>
            5 · Отлично
          </Button>
        </div>
      )}
    </div>
  )
}
