"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { getRedirectPath } from "@/lib/redirect-utils"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { signIn, profile } = useAuth()

  // Handle redirect after successful login
  useEffect(() => {
    if (profile && !loading) {
      const redirectPath = getRedirectPath(profile)
      console.log('Redirecting to:', redirectPath)
      router.push(redirectPath)
    }
  }, [profile, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      console.log('Attempting login for:', email)
      const { error } = await signIn(email, password)
      
      if (error) {
        console.log('Login error:', error)
        
        // Handle different error cases with better messaging for concurrent sessions
        if (error.message?.includes('Email not confirmed') || 
            error.message?.includes('Email not verified') ||
            error.message?.includes('Invalid login credentials') && error.message?.includes('email')) {
          setError("Please check your email and verify your account before logging in")
        } else if (error.message?.includes('Invalid login credentials')) {
          setError("Email or Password is incorrect")
        } else if (error.message?.includes('User already registered') || 
                   error.message?.includes('already exists')) {
          setError("This account is already logged in on another device. You can continue using this session.")
        } else {
          setError(error.message || "An error occurred during login")
        }
        
        setLoading(false)
        return
      }
      
      // Login successful - profile will be fetched by AuthContext
      // and useEffect will handle redirect
      setLoading(false)
      setSuccess(true)
    } catch (error) {
      console.error('Login error:', error)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen bg-black">
        {/* Left Section */}
        <div className="relative hidden w-1/2 p-8 lg:block">
          <div className="h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-purple-400 via-purple-600 to-black">
            <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
              <div className="mb-8">
                <h1 className="text-2xl font-semibold">Zentha Notes</h1>
              </div>
              <h2 className="mb-6 text-4xl font-bold">Welcome Back!</h2>
              <p className="mb-12 text-lg">Your login was successful.</p>

              <div className="w-full max-w-sm space-y-4">
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-lg">Login Successful</span>
                  </div>
                </div>
                <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </span>
                    <span className="text-lg">Redirecting to Dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex w-full items-center justify-center bg-black p-6 lg:w-1/2">
          <div className="w-full max-w-md rounded-[40px] p-12">
            <div className="mx-auto max-w-sm text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-white">Login Successful!</h2>
              <p className="mb-8 text-gray-400">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Section */}
      <div className="relative hidden w-1/2 p-8 lg:block">
        <div className="h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-purple-400 via-purple-600 to-black">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold">Zentha Notes</h1>
            </div>
            <h2 className="mb-6 text-4xl font-bold">Welcome Back</h2>
            <p className="mb-12 text-lg">Access your learning materials and continue your journey.</p>

            <div className="w-full max-w-sm space-y-4">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">1</span>
                  <span className="text-lg">Enter your credentials</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    2
                  </span>
                  <span className="text-lg">Access your dashboard</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                    3
                  </span>
                  <span className="text-lg">Start learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center bg-black p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-[40px] p-12">
          <div className="mx-auto max-w-sm">
            <h2 className="mb-2 text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mb-8 text-gray-400">Login to your Zentha account</p>

            {error && (
              <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/30 p-4">
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@zentha.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="h-12 border-gray-800 bg-black text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  required 
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 pr-10"
                    required 
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 transition-all duration-200 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 transition-all duration-200 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 2l20 20" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="h-12 w-full bg-white text-black hover:bg-gray-100 font-medium" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{' '}
                <a href="/signup" className="text-white hover:underline font-medium">Sign up</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 