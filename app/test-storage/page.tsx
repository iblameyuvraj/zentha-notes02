"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { testStorageSetup, cleanupTestData } from '@/lib/test-storage'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function TestStoragePage() {
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  const runTests = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to test storage functionality",
        variant: "destructive"
      })
      return
    }

    setIsTesting(true)
    setTestResults([])

    // Capture console.log output
    const originalLog = console.log
    const logs: string[] = []
    console.log = (...args) => {
      logs.push(args.join(' '))
      originalLog(...args)
    }

    try {
      const success = await testStorageSetup()
      
      if (success) {
        toast({
          title: "Storage Test Passed",
          description: "All storage functionality is working correctly",
        })
      } else {
        toast({
          title: "Storage Test Failed",
          description: "Check the console for detailed error messages",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Test error:', error)
      toast({
        title: "Test Error",
        description: "An unexpected error occurred during testing",
        variant: "destructive"
      })
    } finally {
      console.log = originalLog
      setTestResults(logs)
      setIsTesting(false)
    }
  }

  const cleanup = async () => {
    setIsTesting(true)
    try {
      await cleanupTestData()
      toast({
        title: "Cleanup Complete",
        description: "Test data has been removed",
      })
    } catch (error) {
      toast({
        title: "Cleanup Error",
        description: "Error during cleanup",
        variant: "destructive"
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Storage Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle>Storage Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                This page helps you test the Supabase storage setup for the teacher dashboard.
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={runTests}
                  disabled={isTesting || !user}
                  className="w-full"
                >
                  {isTesting ? 'Running Tests...' : 'Run Storage Tests'}
                </Button>
                
                <Button 
                  onClick={cleanup}
                  disabled={isTesting}
                  variant="outline"
                  className="w-full"
                >
                  Cleanup Test Data
                </Button>
              </div>

              {!user && (
                <p className="text-yellow-400 text-sm">
                  ⚠️ Please log in to run storage tests
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-gray-400">No test results yet. Run the tests to see output.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testResults.map((log, index) => (
                    <div key={index} className="text-sm font-mono">
                      <span className="text-gray-400">{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-white mb-2">1. Create Storage Bucket</h3>
                <p className="text-gray-400">
                  In your Supabase dashboard, create a bucket named "teacher-uploads" with public access.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">2. Configure Storage Policies</h3>
                <p className="text-gray-400">
                  Add policies to allow authenticated users to upload, view, update, and delete files.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">3. Create Database Table</h3>
                <p className="text-gray-400">
                  Run the SQL from <code className="bg-gray-800 px-1 rounded">supabase & databse/databse-setup/teacher_uploads.sql</code>
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">4. Test the Setup</h3>
                <p className="text-gray-400">
                  Use this page to verify that all components are working correctly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 