import { Button } from "@/components/ui/button"
import { ForgettingCurve } from "./ForgettingCurve"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-16 py-24">
      <div>

        <h1 className="max-w-2xl font-[Fraunces] text-6xl leading-none tracking-tight">
          Вы забываете <em className="font-normal italic text-zinc-500">предсказуемо.</em>
          <br />
          Мы ловим момент до того, как это случится.
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
          Recall показывает карточку ровно на грани забывания — не раньше и не позже.
          Каждый правильный ответ отодвигает следующую встречу дальше: день, неделя,
          месяц.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            to="/decks"
            className={buttonVariants({ variant: "default" })}
          >
            Создать первую колоду
          </Link>
          <Link
            to=""
            className={buttonVariants({ variant: "outline" })}
          >
            Как считается интервал →
          </Link>
        </div>

        <div className="mt-10 flex gap-8 font-mono text-sm text-zinc-500">
          <div>
            <span className="text-white">92%</span> удержание через 30 дней
          </div>

          <div>
            <span className="text-white">4 мин</span> средняя сессия
          </div>

          <div>
            <span className="text-white">0₽</span> для первых 200 карточек
          </div>
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Кривая забывания · одна карточка</CardTitle>
          </CardHeader>

          <CardContent>
            <ForgettingCurve />
            <p className="mt-4 text-sm text-muted-foreground">
              Точка — вы почти забыли и ответили верно. Каждый следующий интервал длиннее предыдущего.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
