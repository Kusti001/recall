import { createContext } from "react"

export interface AuthContextType {
  token: string | null
  login: (token: string) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)
