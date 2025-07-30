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
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-lg flex flex-col items-center">
        <SignupForm />
      </div>
    </div>
  );
}

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
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
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      
      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }, 2000)
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-1">
            <div className="p-6 md:p-8 w-full">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white">Account Created Successfully!</h1>
                  <p className="text-balance text-muted-foreground">Redirecting to login page...</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-1">
          {step === 1 && (
            <form className="p-6 md:p-8 w-full" onSubmit={handleNext}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-white">Create Account</h1>
                  <p className="text-balance text-muted-foreground">Sign up for Zentha</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input id="name" type="text" placeholder="Yuvraj soni" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white">Gmail</Label>
                  <Input id="email" type="email" placeholder="example@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        // Eye open SVG
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        // Eye closed SVG
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.362-2.7A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                      onClick={() => setShowConfirmPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        // Eye open SVG
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        // Eye closed SVG
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.362-2.7A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full">Next</Button>
                {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
              </div>
            </form>
          )}
          {step === 2 && (
            <form className="p-6 md:p-8 w-full" onSubmit={e => { e.preventDefault(); if (validateStep2()) { handleSubmit(e); } }}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="collegeId" className="text-white">College ID</Label>
                  <Input id="collegeId" type="text" placeholder="Enter your college ID" value={collegeId} onChange={e => setCollegeId(e.target.value)} required />
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="year" className="text-white">Year</Label>
                  <Select value={year} onValueChange={value => { setYear(value); setSemester(""); setSubjectCombo(""); }} required>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1st year">1st year</SelectItem>
                        <SelectItem value="2nd year">2nd year</SelectItem>
                      <SelectItem value="3rd year">3rd year</SelectItem>
                      <SelectItem value="4th year">4th year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {year && (
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="semester" className="text-white">Semester</Label>
                    <Select value={semester} onValueChange={setSemester} required>
                      <SelectTrigger id="semester">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSemesterOptions().map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem> 
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {showSubjectCombo && (
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="subjectCombo" className="text-white">Subject Combination</Label>
                    <Select value={subjectCombo} onValueChange={setSubjectCombo} required>
                      <SelectTrigger id="subjectCombo">
                        <SelectValue placeholder="Select subject combination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Physics and PPS">Physics and PPS</SelectItem>
                        <SelectItem value="Chemistry and Civil">Chemistry and Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input id="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} required />
                  <Label htmlFor="agree" className="text-xs text-white">I agree with <a href="#" className="underline">terms and services</a> and Zentha policy.</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
                  <Button type="submit" className="w-full" disabled={!agree || loading}>
                    {loading ? (
                      <span className="flex items-center justify-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Signing Up...</span>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
                {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
} 