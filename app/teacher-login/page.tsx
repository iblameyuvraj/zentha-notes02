"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"

function TeacherLoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { signIn, profile } = useAuth()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      setIsRedirecting(true)
      localStorage.setItem("teacher_token", token)
      router.push("/teacher-dashboard")
    }
  }, [searchParams, router])

  // Check if user is already logged in and is a teacher
  useEffect(() => {
    const checkTeacherAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Fetch profile to check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile && profile.role === 'teacher') {
          router.push("/teacher-dashboard")
        } else if (profile && profile.role !== 'teacher') {
          setError("Access denied. Only teachers can login here.")
          await supabase.auth.signOut()
        }
      }
    }
    
    checkTeacherAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // First, sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        setError("Invalid email or password")
        setLoading(false)
        return
      }

      if (data.user) {
        // Fetch the user's profile to check their role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error('Profile fetch error:', profileError)
          setError("Error fetching user profile")
          setLoading(false)
          return
        }

        // Check if the user is a teacher
        if (profile && profile.role === 'teacher') {
          setSuccess("Login successful! Redirecting to teacher dashboard...")
          setTimeout(() => {
            router.push("/teacher-dashboard")
          }, 1500)
        } else {
          // User is not a teacher, sign them out and show error
          await supabase.auth.signOut()
          setError("Access denied. Only teachers can login to this portal.")
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Left Section */}
      <div className="relative hidden w-1/2 p-8 lg:block">
        <div className="h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-blue-400 via-blue-600 to-black">
          <div className="flex h-full flex-col items-center justify-center px-8 text-center text-white">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold">Zentha Notes</h1>
            </div>
            <h2 className="mb-6 text-4xl font-bold">Teacher Portal</h2>
            <p className="mb-12 text-lg">Only teachers can login here to upload notes.</p>
            <div className="w-full max-w-sm space-y-4">
              <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">1</span>
                  <span className="text-lg">Enter your credentials</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">2</span>
                  <span className="text-lg">Access teacher dashboard</span>
                </div>
              </div>
              <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">3</span>
                  <span className="text-lg">Upload notes for students</span>
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
            <h2 className="mb-2 text-3xl font-bold text-white">Teacher Login</h2>
            <p className="mb-8 text-gray-400">Login to your Zentha teacher account</p>
            {error && (
              <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/30 p-4">
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 rounded-lg bg-green-500/20 border border-green-500/30 p-4">
                <p className="text-green-300 text-sm font-medium">{success}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@zentha.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-12 border-gray-800 bg-black text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
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
                    className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
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
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TeacherLogin() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <TeacherLoginContent />
    </Suspense>
  )
}
