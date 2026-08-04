import { devLogEntries } from "@/devlog/entries"

export function DevLogPage() {
  const sorted = [...devLogEntries].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main className="mx-auto max-w-3xl px-8 py-16">
      <div className="mb-12">
        <h1 className="font-serif text-4xl">Dev log</h1>
        <p className="mt-3 text-muted-foreground">
          Открытый журнал разработки Recall — что делаю, что понял, что сломал.
        </p>
      </div>

      <div className="space-y-12">
        {sorted.map((entry) => (
          <article key={entry.id} className="border-b pb-12 last:border-none">
            <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
              <time>{formatDate(entry.date)}</time>
              <div className="flex gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <h2 className="font-serif text-2xl">{entry.title}</h2>

            <div className="prose prose-neutral dark:prose-invert mt-4 max-w-none text-base leading-relaxed whitespace-pre-line text-foreground/90">
              {entry.content}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
