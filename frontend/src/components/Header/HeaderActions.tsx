import { Link } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"

export function HeaderActions() {
  const token = localStorage.getItem("token")

  if (token) {
    return (
      <Link
        to="/me"
        className={buttonVariants()}
      >
        Профиль
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        to="/login"
        className={buttonVariants({
          variant: "outline",
        })}
      >
        Войти
      </Link>

      <Link
        to="/register"
        className={buttonVariants()}
      >
        Начать бесплатно
      </Link>
    </div>
  )
}
