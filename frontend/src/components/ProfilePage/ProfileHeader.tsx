import { UserCircle2Icon } from "lucide-react"

interface Props {
  current_streak: number
  created_at: string
  display_name: string
}
function formatCreatedAt(date: string) {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function ProfileHeader({ profile }: { profile: Props }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-semibold">
          <UserCircle2Icon className="h-10 w-10" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{profile.display_name}</h1>

          <p className="text-sm text-muted-foreground">
            на Recall с {formatCreatedAt(profile.created_at)}
          </p>
        </div>
      </div>

      <div className="rounded-full border px-4 py-2 text-sm">
        🔥 {profile.current_streak} дней подряд
      </div>
    </div>
  )
}
