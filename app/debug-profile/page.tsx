"use client"

import { useAuth } from "@/contexts/AuthContext"
import { getRedirectPath } from "@/lib/redirect-utils"

export default function DebugProfilePage() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (!user) {
    return <div className="p-8">Not logged in</div>
  }

  const redirectPath = profile ? getRedirectPath(profile) : '/dashboard1/physics'

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile Debug</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">User Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Profile Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Redirect Path:</h2>
          <p className="bg-blue-100 p-4 rounded">
            {redirectPath}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Profile Analysis:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Year: {profile?.year || 'Not set'}</li>
            <li>Semester: {profile?.semester || 'Not set'}</li>
            <li>Subject Combo: {profile?.subject_combo || 'Not set'}</li>
            <li>Has Profile: {profile ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 