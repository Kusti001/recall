import type { ReviewCard as ReviewCardType } from "@/shared/api/api"

interface Props {
  card: ReviewCardType
  revealed: boolean
  onFlip: () => void
}

export function ReviewCard({ card, revealed, onFlip }: Props) {
  return (
    <div
      className="flex min-h-[550px] items-center justify-center"
      style={{ perspective: "1400px" }}
    >
      <button
        type="button"
        onClick={onFlip}
        aria-label={revealed ? "Ответ показан" : "Показать ответ"}
        className="relative h-[460px] w-full max-w-3xl cursor-pointer text-left transition-transform duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <CardFace
          label="Вопрос"
          text={card.front}
          description={card.front_description}
          textSize="text-4xl"
          footer="пробел или клик — показать ответ"
        />

        <CardFace
          label="Ответ"
          text={card.back}
          description={card.back_description}
          textSize="text-3xl"
          flipped
        />
      </button>
    </div>
  )
}

interface CardFaceProps {
  label: string
  text: string
  description?: string | null
  textSize: string
  footer?: string
  flipped?: boolean
}

function CardFace({
  label,
  text,
  description,
  textSize,
  footer,
  flipped,
}: CardFaceProps) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between rounded-3xl border bg-background p-10 shadow-xl"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: flipped ? "rotateY(180deg)" : undefined,
      }}
    >
      <div>
        <span className="inline-flex rounded-full border px-3 py-1 text-xs text-muted-foreground">
          {label}
        </span>

        <div className="mt-10 flex min-h-[180px] items-center justify-center">
          <p
            className={`max-h-[220px] overflow-hidden text-center font-serif ${textSize} leading-tight font-medium`}
          >
            {text}
          </p>
        </div>
      </div>

      {description && (
        <div className="rounded-2xl bg-muted p-5">
          <p className="text-base leading-relaxed">{description}</p>
        </div>
      )}

      {footer && (
        <p className="text-center text-sm text-muted-foreground">{footer}</p>
      )}
    </div>
  )
}
