import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Allow multiple sessions
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Enable multi-session support
    flowType: 'pkce',
    // Don't clear session on sign out from other tabs
    storage: {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key)
        }
        return null
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value)
        }
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key)
        }
      }
    }
  }
})

// Types for our database
export interface Profile {
  id: string
  email: string
  full_name?: string
  role?: string
  year?: number
  semester?: number
  college_id?: string
  subject_combo?: string
  created_at?: string
  last_login?: string
  total_downloads?: number
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    role?: string
    year?: number
    semester?: number
    college_id?: string
    subject_combo?: string
  }
}

// Utility functions for multi-session management
export const sessionUtils = {
  // Check if user is already logged in on another tab
  isLoggedInElsewhere: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return !!session
    } catch (error) {
      console.error('Error checking session:', error)
      return false
    }
  },

  // Get current session info
  getCurrentSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
        return null
      }
      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  },

  // Refresh session if needed
  refreshSession: async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Error refreshing session:', error)
        return { error }
      }
      return { data, error: null }
    } catch (error) {
      console.error('Error refreshing session:', error)
      return { error }
    }
  }
} 