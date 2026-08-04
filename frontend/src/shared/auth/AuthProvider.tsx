import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { setUnauthorizedHandler } from "@/shared/api/client"
import { logout as logoutRequest } from "@/shared/api/auth"
import { AuthContext } from "./AuthContext"

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  )

  function login(token: string) {
    localStorage.setItem("token", token)
    setToken(token)
  }

  function clearSession() {
    localStorage.removeItem("token")
    setToken(null)
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      clearSession()
      navigate("/login")
    }
  }

  function sessionExpired() {
    clearSession()

    toast.error("Session expired", { description: "Please sign in again.", position: "bottom-center" })

    navigate("/login")
  }

  useEffect(() => {
    setUnauthorizedHandler(sessionExpired)
  }, [])

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
