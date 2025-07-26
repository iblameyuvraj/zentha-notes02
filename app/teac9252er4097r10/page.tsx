"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

export default function TeacherSignup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<null | { success: boolean; message: string }>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    if (!name || !email || !password || !confirmPassword) {
      setStatus({ success: false, message: "All fields are required." })
      return
    }
    if (password !== confirmPassword) {
      setStatus({ success: false, message: "Passwords do not match." })
      return
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: "teacher" },
      },
    })
    if (error) {
      setStatus({ success: false, message: error.message })
      return
    }
    setStatus({ success: true, message: "Signup successful. Please check your email to verify your account." })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleSubmit} className="bg-[#18181b] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Teacher Signup</h1>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 text-sm">Name</label>
          <Input type="text" value={name} onChange={e => setName(e.target.value)} className="bg-black text-gray-100 border-gray-700" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 text-sm">Email</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-black text-gray-100 border-gray-700" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 text-sm">Password</label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-black text-gray-100 border-gray-700" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-1 text-sm">Confirm Password</label>
          <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="bg-black text-gray-100 border-gray-700" />
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full">Sign Up</Button>
        {status && (
          <div className={`mt-4 text-sm ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</div>
        )}
      </form>
    </div>
  )
} 