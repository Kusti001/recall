import { Hero } from "@/components/MainPage/Hero"
import { Steps } from "@/components/MainPage/Steps"

export function MainPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        <Hero />
        <Steps />
      </div>
    </main>
  )
}
