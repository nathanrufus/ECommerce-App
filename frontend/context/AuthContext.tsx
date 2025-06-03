"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

type User = {
  id: number
  name: string
  email: string
  role: "customer" | "admin"
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken)
      } catch (err) {
        console.error("Failed to parse stored user:", err)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    }

    setLoading(false)
  }, [])

  const login = (user: User, token: string) => {
    setUser(user)
    setToken(token)
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)
    document.cookie = `token=${token}; path=/`;
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAdmin, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
