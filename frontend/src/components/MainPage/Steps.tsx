const steps = [
  {
    tag: "Занести",
    title: "Карточка за 10 секунд",
    description:
      "Вопрос спереди, ответ сзади...",
  },
  {
    tag: "Ответить честно",
    title: "Четыре степени «помню»",
    description:
      "Забыл, вспомнил с трудом...",
  },
  {
    tag: "Не думать о расписании",
    title: "Recall сам решит, когда напомнить",
    description:
      "Алгоритм разводит карточки...",
  },
]

export function Steps() {
  return (
    <section className="grid overflow-hidden rounded-2xl border border-border md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
      {steps.map((step) => (
        <div key={step.title} className="p-8">
          <div className="font-mono text-xs text-muted-foreground">
            {step.tag}
          </div>

          <h3 className="mt-4 font-serif text-2xl">
            {step.title}
          </h3>

          <p className="mt-3 text-sm text-muted-foreground">
            {step.description}
          </p>
        </div>
      ))}
    </section>
  )
}
