import { Link, useLocation } from "react-router-dom"
import { Logo } from "../Logo"
import { HeaderActions } from "./HeaderActions"
import { useAuth } from "@/shared/auth/useAuth"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"

export function Header() {
  const { t } = useTranslation()
  const { token } = useAuth()
  const location = useLocation()

  const navItems = [
    { label: t("nav.howItWorks"), href: "/how" },
    { label: ".dev", href: "/devlog" },
    ...(token
      ? [
          { label: t("nav.decks"), href: "/decks" },
          { label: t("nav.review"), href: "/review" },
        ]
      : []),
  ]

  return (
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-serif text-xl tracking-tight"
        >
          <Logo />
          Recall
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors hover:text-foreground ${
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <div className="h-5 w-px bg-border" />
          <HeaderActions />
        </div>
      </div>
  )
}
