"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, Profile, AuthUser } from '@/lib/supabase'
import { getRedirectPath } from '@/lib/redirect-utils'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  hasActiveSubscription: boolean
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  checkSubscriptionAndRedirect: () => void
  refreshProfile: () => Promise<Profile | null>
  syncProfileFromServer: () => Promise<Profile | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(true)
  const router = useRouter()

  // Check if user has active subscription
  const hasActiveSubscription = Boolean(profile?.subscription_active && 
    (!profile?.subscription_end_date || new Date(profile.subscription_end_date) > new Date()))

  useEffect(() => {
    let mounted = true
    
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          setInitializing(false)
          return
        }
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
        
        if (mounted) {
          setLoading(false)
          setInitializing(false)
        }
      } catch (error) {
        console.error('Error in getSession:', error)
        if (mounted) {
          setLoading(false)
          setInitializing(false)
        }
      }
    }

    getSession()

    // Listen for auth changes with better error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id)
        
        if (!mounted) return
        
        try {
          // Prevent unnecessary updates during initialization
          if (initializing && event === 'INITIAL_SESSION') {
            return
          }
          
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
          
          if (mounted) {
            setLoading(false)
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
          if (mounted) {
            setLoading(false)
          }
        }
      }
    )

    // Listen for storage changes across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('supabase') || e.key?.includes('auth')) {
        console.log('Storage change detected, refreshing session')
        if (!loading && mounted) {
          getSession()
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
    }

    return () => {
      mounted = false
      subscription.unsubscribe()
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }, [loading, initializing])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      console.log('Profile fetched successfully:', data)
      setProfile(data)
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const syncProfileFromServer = async (): Promise<Profile | null> => {
    try {
      // Get access token
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      if (!accessToken) {
        console.warn('No access token available for sync')
        return null
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      try {
        const res = await fetch('/api/subscription/status', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        if (!res.ok) {
          console.error('syncProfileFromServer HTTP error:', res.status, res.statusText)
          return null
        }
        
        const json = await res.json()
        
        if (!json?.profile) {
          console.error('syncProfileFromServer error: no profile in response', json)
          return null
        }
        
        console.log(`Profile synced in ${json.responseTime || 'unknown'}ms ${json.cached ? '(cached)' : '(fresh)'}`)
        setProfile(json.profile)
        return json.profile as Profile
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error('syncProfileFromServer timeout after 5s')
        } else {
          console.error('syncProfileFromServer fetch error:', fetchError)
        }
        return null
      }
    } catch (e) {
      console.error('syncProfileFromServer exception:', e)
      return null
    }
  }

  const refreshProfile = async (): Promise<Profile | null> => {
    if (!user) return null
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error refreshing profile:', error)
        return null
      }
      setProfile(data)
      return data
    } catch (error) {
      console.error('Error refreshing profile:', error)
      return null
    }
  }

  const fetchProfileAndRedirect = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        router.push('/pay') // Default to payment page on error
        return
      }

      console.log('Profile fetched successfully:', data)
      setProfile(data)

      // Check subscription status and redirect accordingly
      const userHasSubscription = data?.subscription_active && 
        (!data?.subscription_end_date || new Date(data.subscription_end_date) > new Date())
      
      if (userHasSubscription) {
        // User has active subscription, redirect to their dashboard
        const redirectPath = getRedirectPath(data)
        router.push(redirectPath)
      } else {
        // User doesn't have subscription, redirect to payment page
        router.push('/pay')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      router.push('/pay') // Default to payment page on error
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Starting signup with data:', { email, userData })
      
      // Create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${userData.firstName} ${userData.lastName}`,
            role: 'student',
            year: userData.year,
            college_id: userData.collegeId,
            subject_combo: userData.subjectCombo
          }
        }
      })

      if (error) {
        console.error('Signup error:', error)
        return { error }
      }

      console.log('User created successfully:', data.user?.id)

      // After successful signup, redirect to payment page since new users don't have subscription
      if (data.user) {
        setTimeout(() => {
          router.push('/pay')
        }, 100)
      }

      return { error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        setLoading(false)
        return { error }
      }

      if (data.user) {
        console.log('User signed in successfully:', data.user.id)
        // Don't call fetchProfileAndRedirect here - let the auth state change handle it
        // This prevents race conditions and duplicate redirects
      }

      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      setLoading(false)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user')
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        return { error }
      }

      // Refresh profile data
      await fetchProfile(user.id)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const checkSubscriptionAndRedirect = () => {
    if (user && !hasActiveSubscription) {
      router.push('/pay')
    }
  }

  const value = {
    user,
    profile,
    loading,
    hasActiveSubscription,
    signUp,
    signIn,
    signOut,
    updateProfile,
    checkSubscriptionAndRedirect,
    refreshProfile,
    syncProfileFromServer
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
