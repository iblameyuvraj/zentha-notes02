"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { mapYearToNumber, mapSemesterToNumber, mapSubjectComboToValue } from "@/lib/redirect-utils"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [collegeId, setCollegeId] = useState("")
  const [year, setYear] = useState("")
  const [semester, setSemester] = useState("")
  const [subjectCombo, setSubjectCombo] = useState("")
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { signUp } = useAuth()

  const getSemesterOptions = () => {
    switch (year) {
      case "1st year": return ["1st", "2nd"]
      case "2nd year": return ["3rd", "4th"]
      case "3rd year": return ["5th", "6th"]
      case "4th year": return ["7th", "8th"]
      default: return []
    }
  }

  const showSubjectCombo = year === "1st year"

  const validateStep1 = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return false
    }
    setError("")
    return true
  }

  const validateStep2 = () => {
    if (!collegeId) {
      setError("College ID is required.")
      return false
    }
    if (!year) {
      setError("Please select year first.")
      return false
    }
    if (!semester) {
      setError("Please select semester.")
      return false
    }
    if (showSubjectCombo && !subjectCombo) {
      setError("Please select subject combination.")
      return false
    }
    setError("")
    return true
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!validateStep2()) {
      setLoading(false)
      return
    }

    try {
      // Extract first and last name
      const nameParts = name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Prepare user data
      const userData = {
        firstName,
        lastName,
        year: mapYearToNumber(year),
        semester: mapSemesterToNumber(semester),
        collegeId: collegeId,
        subjectCombo: mapSubjectComboToValue(subjectCombo)
      }

      // Add timeout to prevent hanging
      const signupPromise = signUp(email, password, userData)
      const timeoutPromise = new Promise<{ error: any }>((_, reject) => 
        setTimeout(() => reject(new Error('Signup timeout')), 10000)
      )

      const result = await Promise.race([signupPromise, timeoutPromise])
      const { error } = result

      if (error) {
        console.log('Signup error:', error)
        
        // Handle different signup error cases
        if (error.message?.includes('User already registered')) {
          setError("An account with this email already exists. Please login instead.")
        } else if (error.message?.includes('Password should be at least')) {
          setError("Password must be at least 6 characters long")
        } else if (error.message?.includes('Invalid email')) {
          setError("Please enter a valid email address")
        } else {
          setError(error.message || "Failed to create account")
        }
        
        setLoading(false)
        return
      }

      setLoading(false)
      setSuccess(true)
      
      // Redirect after 1 second
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    } catch (error) {
      console.error('Signup error:', error)
      if (error instanceof Error && error.message === 'Signup timeout') {
        setError("Signup is taking too long. Please try again.")
      } else {
        setError("An unexpected error occurred")
      }
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
              <h2 className="mb-6 text-4xl font-bold">Account Created!</h2>
              <p className="mb-12 text-lg">Please check your email to verify your account.</p>

              <div className="w-full max-w-sm space-y-4">
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-lg">Account Created Successfully</span>
                  </div>
                </div>
                <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="text-lg">Check Email for Verification</span>
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
              <h2 className="mb-2 text-3xl font-bold text-white">Account Created!</h2>
              <p className="mb-8 text-gray-400">Please check your email to verify your account before logging in.</p>
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
            <h2 className="mb-6 text-4xl font-bold">Get Started with Us</h2>
            <p className="mb-12 text-lg">Complete these easy steps to register your account.</p>

            <div className="w-full max-w-sm space-y-4">
              <div className={`rounded-lg p-4 backdrop-blur-sm ${step >= 1 ? 'bg-white/10' : 'bg-white/5'}`}>
                <div className="flex items-center gap-4">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>
                    1
                  </span>
                  <span className="text-lg">Sign up your account</span>
                </div>
              </div>
              <div className={`rounded-lg p-4 backdrop-blur-sm ${step >= 2 ? 'bg-white/10' : 'bg-white/5'}`}>
                <div className="flex items-center gap-4">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>
                    2
                  </span>
                  <span className="text-lg">Set up your profile</span>
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
            <h2 className="mb-2 text-3xl font-bold text-white">Sign Up Account</h2>
            <p className="mb-8 text-gray-400">Enter your personal data to create your account.</p>

            {error && (
              <div className="mb-6 rounded-lg bg-red-500/20 border border-red-500/30 p-4">
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="John"
                      type="text"
                      value={name.split(' ')[0] || ''}
                      onChange={e => {
                        const firstName = e.target.value
                        const lastName = name.split(' ').slice(1).join(' ')
                        setName(firstName + (lastName ? ' ' + lastName : ''))
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Doe"
                      type="text"
                      value={name.split(' ').slice(1).join(' ') || ''}
                      onChange={e => {
                        const lastName = e.target.value
                        const firstName = name.split(' ')[0] || ''
                        setName(firstName + (lastName ? ' ' + lastName : ''))
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email</Label>
                  <Input
                    id="email"
                    className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="example@zentha.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 pr-10"
                      placeholder="Your best password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">Must be at least 8 characters.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 pr-10"
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="h-12 w-full bg-white text-black hover:bg-gray-100 font-medium">
                  Next Step
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="collegeId" className="text-white font-medium">College ID</Label>
                  <Input
                    id="collegeId"
                    className="h-12 border-gray-800 bg-gray-900 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter your college ID (e.g., 24CS125)"
                    type="text"
                    value={collegeId}
                    onChange={e => {
                      const value = e.target.value.toUpperCase();
                      setCollegeId(value);

                      // Validate format: 2 digits + 2 letters + 3 digits
                      const idRegex = /^(\d{2})([A-Z]{2})(\d{3})$/;
                      if (value && !idRegex.test(value)) {
                        setError("College ID must be in format: 24CS125 (2 digits year, 2 letters branch, 3 digits roll no)");
                      } else {
                        setError("");
                      }
                    }}
                    required
                  />
                  <p className="text-xs text-gray-400">
                    Format: <span className="font-mono">24CS125</span> (2 digits year, 2 letters branch, 3 digits roll no)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-white font-medium">Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="h-12 border-gray-800 bg-gray-900 text-white focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-900">
                      <SelectItem className="text-white" value="1st year">1st Year</SelectItem>
                      <SelectItem className="text-white" value="2nd year">2nd Year</SelectItem>
                      <SelectItem className="text-white" value="3rd year">3rd Year</SelectItem>
                      <SelectItem className="text-white" value="4th year">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester" className="text-white font-medium">Semester</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger className="h-12 border-gray-800 bg-gray-900 text-white focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-900">
                      {getSemesterOptions().map((sem) => (
                        <SelectItem className="text-white" key={sem} value={sem}>{sem} Semester</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showSubjectCombo && (
                  <div className="space-y-2">
                    <Label htmlFor="subjectCombo" className="text-white font-medium">Subject Combination</Label>
                    <Select value={subjectCombo} onValueChange={setSubjectCombo}>
                      <SelectTrigger className="h-12 border-gray-800 bg-gray-900 text-white focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Select subject combination" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-900">
                        <SelectItem className="text-white" value="1">Physics & PPS</SelectItem>
                        <SelectItem className="text-white" value="2">Chemistry & Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agree}
                    onChange={e => setAgree(e.target.checked)}
                    className="rounded border-gray-800 bg-gray-900 text-purple-500 focus:ring-purple-500 mt-1"
                  />
                  <Label htmlFor="agree" className="text-sm text-gray-400 leading-relaxed">
                    I agree to the <a href="#" className="text-purple-300 hover:text-purple-200 underline">Terms of Service</a> and <a href="#" className="text-purple-300 hover:text-purple-200 underline">Privacy Policy</a>
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1 h-12 border-gray-800 bg-gray-900 text-white hover:bg-gray-800">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 h-12 bg-white text-black hover:bg-gray-100 font-medium" disabled={loading || !agree}>
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-white hover:underline font-medium">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 