"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      
      // Show success message for 2 seconds then redirect
      setTimeout(() => {
        router.push('/dashboard1/chemistry')
      }, 2000)
    }, 1500)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-black">
        <div className="w-full max-w-xl flex flex-col items-center">
          <div className={cn("flex flex-col gap-6 w-full")}>
            <Card className="overflow-hidden w-full">
              <CardContent className="grid p-0 md:grid-cols-2 w-full">
                <div className="p-6 md:p-8 w-full">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h1 className="text-2xl font-bold text-white">Login Successful!</h1>
                      <p className="text-balance text-muted-foreground">Redirecting to dashboard...</p>
                    </div>
                  </div>
                </div>
                <div className="relative hidden bg-muted md:block w-full">
                  <img
                    src="/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-black">
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className={cn("flex flex-col gap-6 w-full")}>
          <Card className="overflow-hidden w-full">
            <CardContent className="grid p-0 md:grid-cols-2 w-full">
              <form className="p-6 md:p-8 w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                    <p className="text-balance text-muted-foreground">Login to your Zentha account</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-white">Gmail</Label>
                    <Input id="email" type="email" placeholder="example@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Login...</span>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <div className="text-center text-sm text-white">
                    Don&apos;t have an account?{' '}
                    <a href="/signup" className="underline underline-offset-4">Sign up</a>
                  </div>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block w-full">
                <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By logging in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  )
} 