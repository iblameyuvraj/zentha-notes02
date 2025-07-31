"use client"

import { createContext, useContext, ReactNode } from 'react'

interface AuthContextType {
  user: any | null
  profile: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: false,
  signIn: async () => ({ error: { message: 'Auth not implemented' } }),
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const signIn = async (email: string, password: string) => {
    // Placeholder implementation
    return { error: { message: 'Auth not implemented' } }
  }

  return (
    <AuthContext.Provider value={{ user: null, profile: null, loading: false, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
} 