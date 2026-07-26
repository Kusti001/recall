import { Button } from "@/components/ui/button"


interface Props {
  totalDecks: number
  totalDue: number
  onCreate: () => void
}


export function DecksHeader({
  totalDecks,
  totalDue,
  onCreate,
}: Props) {
  return (
    <div className="flex items-end justify-between">

      <div>
        <h1 className="font-serif text-4xl">
          Колоды
        </h1>

        <p className="mt-2 text-muted-foreground">
          {totalDecks} колод · {totalDue} карточек к повторению сегодня
        </p>
      </div>


      <Button onClick={onCreate}>
        + Новая колода
      </Button>

    </div>
  )
}
