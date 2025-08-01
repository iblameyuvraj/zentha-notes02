"use client"

import { useAuth } from "@/contexts/AuthContext"
import { sessionUtils } from "@/lib/supabase"
import { useState } from "react"

export default function TestDBPage() {
  const { user, profile, signOut } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  const testSession = async () => {
    const session = await sessionUtils.getCurrentSession()
    setSessionInfo(session)
  }

  const testMultiSession = async () => {
    const isLoggedInElsewhere = await sessionUtils.isLoggedInElsewhere()
    console.log('Is logged in elsewhere:', isLoggedInElsewhere)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test Database & Session</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Current User</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Current Profile</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Session Info</h2>
          <button 
            onClick={testSession}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Test Session
          </button>
          <button 
            onClick={testMultiSession}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Test Multi-Session
          </button>
          {sessionInfo && (
            <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          )}
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Actions</h2>
          <button 
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
} 