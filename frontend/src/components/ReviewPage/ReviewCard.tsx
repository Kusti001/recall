import type { ReviewCard as ReviewCardType } from "@/shared/api/api"

interface Props {
  card: ReviewCardType
  revealed: boolean
  onFlip: () => void
}

export function ReviewCard({ card, revealed, onFlip }: Props) {
  return (
    <div className="flex min-h-[550px] items-center justify-center" style={{ perspective: "1400px" }}>
      <button
        type="button"
        onClick={onFlip}
        aria-label={revealed ? "Ответ показан" : "Показать ответ"}
        className="relative h-[420px] w-full max-w-3xl cursor-pointer text-left transition-transform duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-3xl border bg-background p-14 text-center shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <p className="font-serif text-4xl leading-relaxed">{card.front}</p>
            <p className="mt-20 text-sm text-muted-foreground">пробел или клик — показать ответ</p>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-3xl border bg-background p-14 text-center shadow-sm"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="w-full">
            <p className="font-serif text-3xl leading-relaxed">{card.front}</p>
            <div className="mx-auto my-10 h-px w-24 bg-border" />
            <p className="text-xl leading-relaxed text-muted-foreground">{card.back}</p>
          </div>
        </div>
      </button>
    </div>
  )
}
