import { Link } from "react-router-dom"
import { LogoutButton } from "@/components/LogoutButton"

export function Navbar() {
  return (
    <div className="flex gap-4 border-b p-3">
      <Link to="/">Главная</Link>
      <Link to="/decks">Колоды</Link>
      <Link to="/review">Повторение</Link>
      <Link to="/me">Профиль</Link>
      <LogoutButton />
      <Link to="/login">Вход</Link>
    </div>
  )
}
