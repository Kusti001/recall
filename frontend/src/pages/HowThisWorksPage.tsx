export function HowThisWorksPage() {
  return (
    <main className="mx-auto max-w-2xl px-8 py-16">
      <h1 className="font-serif text-3xl">Как это работает</h1>

      <p className="mt-4 text-muted-foreground">
        Recall использует алгоритм интервальных повторений, основанный на
        классическом SM-2. После каждого ответа вы оцениваете, насколько легко
        вспомнили карточку - от этой оценки зависит следующий интервал
        повторения.
      </p>

      <div className="mt-10 space-y-6">
        <section>
          <h2 className="font-serif text-xl">
            🔴 Ошибка - карточка возвращается в начало
          </h2>

          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <b className="text-foreground">0 · Провал</b> - не вспомнили
              ответ.
            </li>

            <li>
              <b className="text-foreground">1 · Ошибка</b> - ответ оказался
              неверным, но после подсказки показался знакомым.
            </li>

            <li>
              <b className="text-foreground">2 · Почти вспомнил</b> - ответ был
              рядом, но самостоятельно вспомнить не получилось.
            </li>
          </ul>

          <p className="mt-3 text-muted-foreground">
            При оценке ниже 3 карточка считается забытой: интервал сбрасывается
            до 1 дня, а цикл повторений начинается заново.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl">
            🟢 Успешный ответ - интервал увеличивается
          </h2>

          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <b className="text-foreground">3 · С трудом</b> - вспомнили, но
              потребовалось много усилий.
            </li>

            <li>
              <b className="text-foreground">4 · Хорошо</b> - вспомнили с
              небольшой задержкой.
            </li>

            <li>
              <b className="text-foreground">5 · Легко</b> - ответ пришёл
              мгновенно.
            </li>
          </ul>

          <p className="mt-3 text-muted-foreground">
            При успешном ответе интервал увеличивается: первые повторения идут
            через 1 и 6 дней, а затем рассчитываются на основе предыдущего
            интервала и коэффициента лёгкости карточки.
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Коэффициент лёгкости изменяется после каждого ответа: лёгкие карточки
        появляются реже, а сложные - чаще. Так Recall подстраивает расписание
        повторений под вашу память.
      </p>
    </main>
  )
}
