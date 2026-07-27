export function HowThisWorksPage() {
  return (
    <main className="mx-auto max-w-2xl px-8 py-16">
      <h1 className="font-serif text-3xl">Как это работает</h1>
      <p className="mt-4 text-muted-foreground">
        Recall использует алгоритм интервальных повторений SM-2. После каждого
        ответа вы оцениваете, насколько легко вспомнили карточку — от этого
        зависит, через сколько дней она появится снова.
      </p>

      <div className="mt-10 space-y-6">
        <section>
          <h2 className="font-serif text-xl">
            🔴 Забыли — интервал сбрасывается
          </h2>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <b className="text-foreground">0 · Провал</b> — вообще не
              вспомнили ответ.
            </li>
            <li>
              <b className="text-foreground">1 · Ошибка</b> — ответили неверно,
              но при виде ответа он показался знакомым.
            </li>
            <li>
              <b className="text-foreground">2 · Почти вспомнил</b> — ошиблись,
              но ответ был «на языке».
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl">🟢 Вспомнили — интервал растёт</h2>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <b className="text-foreground">3 · С трудом</b> — ответили верно,
              но с большим усилием.
            </li>
            <li>
              <b className="text-foreground">4 · Хорошо</b> — верно, с небольшой
              заминкой.
            </li>
            <li>
              <b className="text-foreground">5 · Легко</b> — вспомнили
              мгновенно, без усилий.
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Чем увереннее ответ, тем длиннее следующий интервал. Ошибка возвращает
        карточку в начало цикла повторений.
      </p>
    </main>
  )
}
