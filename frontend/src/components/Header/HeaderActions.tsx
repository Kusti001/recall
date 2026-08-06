import { Link, useNavigate } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/shared/auth/useAuth"
import { useTranslation } from "react-i18next"

export function HeaderActions() {
  const { t } = useTranslation()
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
          {t("nav.profile")}
        </Link>

        <button
          onClick={handleLogout}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          {t("nav.logout")}
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
        {t("nav.join")}
      </Link>

      <Link to="/register" className={buttonVariants()}>
        {t("nav.start")}
      </Link>
    </div>
  )
}
