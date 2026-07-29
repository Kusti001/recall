import { useState } from "react"
import type { ReactNode } from "react"

import { logout as logoutRequest } from "@/shared/api/auth"
import { AuthContext } from "./AuthContext"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  )

  function login(token: string) {
    localStorage.setItem("token", token)
    setToken(token)
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      localStorage.removeItem("token")
      setToken(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
