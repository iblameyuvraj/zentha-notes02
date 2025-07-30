"use client"

import { useState } from 'react'
import { testDatabaseConnection } from '@/lib/test-db'
import { supabase } from '@/lib/supabase'

export default function TestDBPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      const testResult = await testDatabaseConnection()
      setResult(JSON.stringify(testResult, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setLoading(true)
    setResult('Testing auth...')
    
    try {
      const { data, error } = await supabase.auth.getSession()
      setResult(JSON.stringify({ data, error }, null, 2))
    } catch (error) {
      setResult(`Auth Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test Page</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Test Database Connection
        </button>
        
        <button 
          onClick={testAuth}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 ml-2"
        >
          Test Auth
        </button>
      </div>
      
      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
} 