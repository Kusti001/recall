import { Link, useNavigate } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/useAuth"

export function HeaderActions() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/", { replace: true })
  }

  if (token) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/profile" className={buttonVariants()}>
          Профиль
        </Link>

        <button
          onClick={handleLogout}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Выйти
        </button>
      </div>
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

      <Link to="/register" className={buttonVariants()}>
        Начать
      </Link>
    </div>
  )
}
