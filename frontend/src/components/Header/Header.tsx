import { Link } from "react-router-dom"
import { Logo } from "../Logo"
import { HeaderActions } from "./HeaderActions"
import { useAuth } from "@/shared/auth/useAuth"

export function Header() {
  const { token } = useAuth()

  const navItems = [
    {
      label: "Как это работает",
      href: "/how",
    },

    ...(token
      ? [
          {
            label: "Колоды",
            href: "/decks",
          },
          {
            label: "Повторение",
            href: "/review",
          },
        ]
      : []),
  ]

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <Link
        to="/"
        className="flex items-center gap-2 font-serif text-xl tracking-tight"
      >
        <Logo />
        Recall
      </Link>

      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <HeaderActions />
    </header>
  )
}
