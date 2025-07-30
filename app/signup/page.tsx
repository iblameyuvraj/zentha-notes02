"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

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

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }, 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="w-full max-w-lg flex flex-col items-center">
          <div className={cn("flex flex-col gap-6 w-full")}>
            <Card className="overflow-hidden w-full">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Account Created!</h1>
                    <p className="text-balance text-muted-foreground">Redirecting to login...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-lg flex flex-col items-center">
        <div className={cn("flex flex-col gap-6 w-full")}>
          <Card className="overflow-hidden w-full">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-white">Create Account</h1>
                  <p className="text-balance text-muted-foreground">Join Zentha Notes</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {step === 1 ? (
                  <form onSubmit={handleNext} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Enter your full name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirm your password" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Next
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="collegeId" className="text-white">College ID</Label>
                      <Input 
                        id="collegeId" 
                        type="text" 
                        placeholder="Enter your college ID" 
                        value={collegeId} 
                        onChange={e => setCollegeId(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="year" className="text-white">Year</Label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st year">1st Year</SelectItem>
                          <SelectItem value="2nd year">2nd Year</SelectItem>
                          <SelectItem value="3rd year">3rd Year</SelectItem>
                          <SelectItem value="4th year">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="semester" className="text-white">Semester</Label>
                      <Select value={semester} onValueChange={setSemester}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSemesterOptions().map((sem) => (
                            <SelectItem key={sem} value={sem}>{sem} Semester</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {showSubjectCombo && (
                      <div className="grid gap-2">
                        <Label htmlFor="subjectCombo" className="text-white">Subject Combination</Label>
                        <Select value={subjectCombo} onValueChange={setSubjectCombo}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject combination" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Information Technology">Information Technology</SelectItem>
                            <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                            <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                            <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="agree"
                        checked={agree}
                        onChange={e => setAgree(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="agree" className="text-sm text-white">
                        I agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={loading || !agree}>
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

                <div className="text-center text-sm text-white">
                  Already have an account?{' '}
                  <a href="/login" className="underline underline-offset-4">Login</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 