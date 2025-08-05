"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { testTeacherUploads } from "@/lib/test-uploads"
import { getAllUploadsForTesting } from "@/lib/storage"

export default function TestUploadsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runTest = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const testResult = await testTeacherUploads()
      setResult(testResult)
    } catch (error) {
      setResult({ success: false, error: 'Test failed' })
    } finally {
      setLoading(false)
    }
  }

  const runRLSTest = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const testResult = await getAllUploadsForTesting()
      setResult(testResult)
    } catch (error) {
      setResult({ success: false, error: 'RLS Test failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Test Teacher Uploads</h1>
        
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={runTest} 
            disabled={loading}
          >
            {loading ? 'Running Test...' : 'Run Database Test'}
          </Button>
          
          <Button 
            onClick={runRLSTest} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Running Test...' : 'Test RLS Bypass'}
          </Button>
        </div>

        {result && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <div className="space-y-4">
                <div>
                  <strong>Success:</strong> {result.success ? '✅ Yes' : '❌ No'}
                </div>
                
                {result.error && (
                  <div>
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                
                {result.success && (
                  <>
                    <div>
                      <strong>Total Records:</strong> {result.totalCount}
                    </div>
                    <div>
                      <strong>Approved Uploads:</strong> {result.approvedCount}
                    </div>
                    
                    {result.sampleData && result.sampleData.length > 0 && (
                      <div>
                        <strong>Sample Data:</strong>
                        <pre className="mt-2 p-4 bg-gray-900 rounded text-sm overflow-auto">
                          {JSON.stringify(result.sampleData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 