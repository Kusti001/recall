import { Button, buttonVariants } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Logo } from "../Logo"
import { HeaderActions } from "./HeaderActions"

export function Header() {
  const navItems = [
    {
      label: "How this works",
      href: "how",
    },
    {
      label: "Decks",
      href: "/decks",
    },
    {
      label: "Review",
      href: "/review",
    },
    /*
    {
      label: "Тарифы",
      href: "pricing",
    },*/
  ]

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 font-serif text-xl tracking-tight"
      >
        <Logo/>

        Recall
      </Link>


      {/* Navigation */}
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


      {/* Actions */}
      <HeaderActions/>
    </header>
  )
}
