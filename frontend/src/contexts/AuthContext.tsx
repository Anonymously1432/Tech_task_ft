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
  isClient: boolean
  isManager: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<LoginResponse>
  register: (data: {
    email: string
    password: string
    fullName: string
    phone: string
    birthDate: string
  }) => Promise<{ id: number; email: string; fullName: string }>
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isClient: false,
    isManager: false,
  })

  const refreshUser = () => {
    const stored = getStoredUser() as User | null
    const token = hasValidToken()
    setState({
      user: token ? stored : null,
      loading: false,
      isClient: !!(stored && stored.role === 'client'),
      isManager: !!(stored && stored.role === 'manager'),
    })
  }

  useEffect(() => {
    const stored = getStoredUser() as User | null
    const token = hasValidToken()
    setState({
      user: token ? stored : null,
      loading: false,
      isClient: !!(stored && stored.role === 'client'),
      isManager: !!(stored && stored.role === 'manager'),
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
      isClient: res.user.role === 'client',
      isManager: res.user.role === 'manager',
    })
    return res
  }

  const register = async (data: {
    email: string
    password: string
    fullName: string
    phone: string
    birthDate: string
  }) => {
    const res = await api<{ id: number; email: string; fullName: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          birthDate: data.birthDate,
        }),
      }
    )
    return res
  }

  const logout = () => {
    clearAuthData()
    setState({
      user: null,
      loading: false,
      isClient: false,
      isManager: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
