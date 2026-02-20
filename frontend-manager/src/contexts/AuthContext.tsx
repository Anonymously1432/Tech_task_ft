import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  clearAuthData,
  getStoredUser,
  hasValidToken,
  setAuthData,
  api,
} from '../api/client'
import type { LoginResponse, User } from '../types'

interface AuthState {
  user: User | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  })

  useEffect(() => {
    const stored = getStoredUser() as User | null
    const token = hasValidToken()
    setState({
      user: token ? stored : null,
      loading: false,
    })
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setAuthData(res.accessToken, res.refreshToken, res.user)
    setState({
      user: res.user,
      loading: false,
    })
    return res
  }

  const logout = () => {
    clearAuthData()
    setState({
      user: null,
      loading: false,
    })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
