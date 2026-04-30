import { createContext, useContext, useMemo, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('verdant_token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('verdant_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const persistAuth = (auth) => {
    localStorage.setItem('verdant_token', auth.token)
    localStorage.setItem('verdant_user', JSON.stringify(auth.user))
    setToken(auth.token)
    setUser(auth.user)
  }

  const login = async (payload) => {
    setLoading(true)
    try {
      const auth = await authService.login(payload)
      persistAuth(auth)
      return auth
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const auth = await authService.register(payload)
      persistAuth(auth)
      return auth
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('verdant_token')
    localStorage.removeItem('verdant_user')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout
    }),
    [token, user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
