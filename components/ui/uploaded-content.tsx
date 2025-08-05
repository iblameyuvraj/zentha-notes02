"use client"

import { useState, useEffect } from "react"
import { Download, Filter, FileText, Calendar, BookOpen, GraduationCap, User, Clock, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getAllApprovedUploads, getApprovedUploadsByFilter } from "@/lib/storage"

interface UploadedContent {
  id: string
  title: string
  year: string
  semester?: string
  subject_combo?: string
  subject: string
  type: 'Notes' | 'Assignment'
  description?: string
  file_path: string
  download_url?: string
  file_size?: number
  file_name?: string
  uploaded_by: string
  created_at: string
}

export default function UploadedContent() {
  const [uploads, setUploads] = useState<UploadedContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [semesterFilter, setSemesterFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [subjectComboFilter, setSubjectComboFilter] = useState("all")
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<UploadedContent | null>(null)

  useEffect(() => {
    fetchUploads()
  }, [])

  const fetchUploads = async () => {
    setLoading(true)
    setError("")
    
    try {
      const result = await getAllApprovedUploads()
      
      if (result.success) {
        setUploads(result.data)
      } else {
        setError(result.error || "Failed to fetch uploads")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error('Error fetching uploads:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFilteredUploads = async () => {
    setLoading(true)
    setError("")
    
    try {
      const filters: any = {}
      if (yearFilter !== "all") filters.year = yearFilter
      if (semesterFilter !== "all") filters.semester = semesterFilter
      if (subjectFilter !== "all") filters.subject = subjectFilter
      if (typeFilter !== "all") filters.type = typeFilter
      if (subjectComboFilter !== "all") filters.subjectCombo = subjectComboFilter
      
      const result = await getApprovedUploadsByFilter(filters)
      
      if (result.success) {
        setUploads(result.data)
      } else {
        setError(result.error || "Failed to fetch uploads")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error('Error fetching filtered uploads:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (subjectFilter !== "all" || semesterFilter !== "all" || typeFilter !== "all" || yearFilter !== "all" || subjectComboFilter !== "all") {
      fetchFilteredUploads()
    } else {
      fetchUploads()
    }
  }, [subjectFilter, semesterFilter, typeFilter, yearFilter, subjectComboFilter])

  const clearAllFilters = () => {
    setSubjectFilter("all")
    setSemesterFilter("all")
    setTypeFilter("all")
    setYearFilter("all")
    setSubjectComboFilter("all")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Notes":
        return <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case "Assignment":
        return <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      default:
        return <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Notes":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Assignment":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleDownload = (downloadUrl: string, filename: string) => {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleAskChatGPT = (file: UploadedContent) => {
    setSelectedFile(file)
    setShowAIDialog(true)
  }

  const handleConfirmAI = () => {
    if (selectedFile && selectedFile.download_url) {
      // Download the file first
      handleDownload(selectedFile.download_url, selectedFile.file_name || selectedFile.title)
      
      // Create a ChatGPT prompt with file information
      const prompt = `I need help understanding the "${selectedFile.title}" (${selectedFile.subject}, ${selectedFile.type}). I am uploading the file to you and you will help me to understand the content and answer any questions I have.`
      
      // Encode the prompt for URL
      const encodedPrompt = encodeURIComponent(prompt)
      
      // Close dialog and redirect to ChatGPT with the prompt
      setShowAIDialog(false)
      setSelectedFile(null)
      window.open(`https://chat.openai.com/?prompt=${encodedPrompt}`, '_blank')
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTeacherName = (upload: UploadedContent) => {
    // For now, return a generic teacher name since we don't have user details
    // In the future, we can fetch user details separately if needed
    return "Teacher"
  }

  // Get unique values for filters
  const uniqueSubjects = [...new Set(uploads.map(u => u.subject))]
  const uniqueYears = [...new Set(uploads.map(u => u.year))]
  const uniqueSemesters = [...new Set(uploads.filter(u => u.semester).map(u => u.semester!))]
  const uniqueSubjectCombos = [...new Set(uploads.filter(u => u.subject_combo).map(u => u.subject_combo!))]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading uploads...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white dark:text-gray-100 mb-2">Uploaded Content</h1>
        <p className="text-gray-600 dark:text-gray-300">Access notes and assignments uploaded by teachers</p>
      </div>

      {/* Filters */}
      <div className="bg-black dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-white dark:text-gray-100">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
              <SelectItem value="all">All Subjects</SelectItem>
              {uniqueSubjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Notes">Notes</SelectItem>
              <SelectItem value="Assignment">Assignment</SelectItem>
            </SelectContent>
          </Select>


        </div>

        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={clearAllFilters}
            className="bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border-gray-200 text-center dark:border-gray-600"
          >
            Clear All Filters
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300">
          Showing {uploads.length} uploaded documents
        </p>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads.map((upload) => (
          <Card
            key={upload.id}
            className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(upload.type)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(upload.type)}`}>
                    {upload.type}
                  </span>
                </div>
              </div>
              <CardTitle className="text-lg leading-tight text-gray-900 dark:text-gray-100">{upload.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {upload.subject}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Year {upload.year} {upload.semester && `• ${upload.semester}`}
                </div>
                {/* soon adding teacher name and email */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4 mr-2" />
                      {getTeacherName(upload)}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDate(upload.created_at)}
                </div>
                {upload.file_size && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FileText className="w-4 h-4 mr-2" />
                    {formatFileSize(upload.file_size)}
                  </div>
                )}
              </div>
              {upload.description && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{upload.description}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={() => handleDownload(upload.download_url || '', upload.file_name || upload.title)}
                  disabled={!upload.download_url}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1" 
                  size="sm"
                  onClick={() => handleAskChatGPT(upload)}
                  disabled={!upload.download_url}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {uploads.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No uploads found</h3>
          <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters or check back later for new content.</p>
        </div>
      )}

      {/* AI Assistant Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-400" />
              AI Assistant Instructions
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-4 space-y-3">
              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-200 font-medium mb-2">📋 What will happen:</p>
                <ul className="text-sm text-blue-300 space-y-1">
                  <li>• The file will be downloaded to your device</li>
                  <li>• ChatGPT will open in a new tab</li>
                  <li>• You'll need to upload the downloaded file to ChatGPT</li>
                  <li>• The AI will help you with the content</li>
                </ul>
              </div>
              <p className="text-sm text-gray-400">
                Click "OK" to proceed with downloading the file and opening ChatGPT.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAIDialog(false)
                setSelectedFile(null)
              }}
              className="flex-1 border-gray-700 text-black hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmAI}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 