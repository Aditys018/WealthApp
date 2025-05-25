import { createContext, useContext, useEffect, useState } from 'react'

interface Tokens {
  accessToken: string
  refreshToken: string
}

interface User {
  _id: string
  email: string
  role: string
  // Add more fields as needed
}

interface AuthContextType {
  user: User | null
  tokens: Tokens | null
  login: (user: User, tokens: Tokens) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<Tokens | null>(null)

  // Hydrate from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')

    if (storedUser && storedAccessToken && storedRefreshToken) {
      try {
        const parsedUser: User = JSON.parse(storedUser)
        setUser(parsedUser)
        setTokens({
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
        })
      } catch (error) {
        console.error('Failed to parse stored user', error)
        // Clear corrupt data
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    }
  }, [])

  const login = (user: User, tokens: Tokens) => {
    setUser(user)
    setTokens(tokens)
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    setTokens(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
