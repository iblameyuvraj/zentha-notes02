"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, FileText, Trash2, Edit, Calendar, User, LogOut, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useDropzone, FileRejection } from "react-dropzone"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { uploadFile, saveUploadRecord, getTeacherUploads, deleteUpload, type UploadData } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

const mockUploads = [
  {
    id: 1,
    title: "Advanced Algorithms Notes",
    type: "Notes",
    dateUploaded: "2024-01-15",
    status: "Approved",
  },
  {
    id: 2,
    title: "Data Mining Assignment",
    type: "Assignment",
    dateUploaded: "2024-01-12",
    status: "Pending",
  },
  {
    id: 3,
    title: "Machine Learning Notes",
    type: "Notes",
    dateUploaded: "2024-01-10",
    status: "Approved",
  },
]

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
}

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
}

function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void
}) => {
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (newFiles: File[]) => {
    // Only allow single file upload
    if (newFiles.length > 1) {
      alert('Only one file can be uploaded at a time. For multiple files, please create a ZIP or 7Z archive.')
      return
    }

    const file = newFiles[0]
    if (!file) return

    // Filter files by type and size
    const validTypes = [' /pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif', 'application/zip', 'application/x-7z-compressed']
    const maxSize = 25 * 1024 * 1024 // 25MB
    
    if (!validTypes.includes(file.type)) {
      alert('Only PDF, DOC, DOCX, image files, ZIP, and 7Z files are allowed')
      return
    }
    
    if (file.size > maxSize) {
      alert('File size must be under 25MB')
      return
    }

    // Replace any existing files with the new one
    setFiles([file])
    onChange && onChange([file])
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (fileRejections: FileRejection[]) => {
      console.log(fileRejections)
      if (fileRejections.length > 0 && fileRejections[0].errors.length > 0) {
        const errorMessage = fileRejections[0].errors[0].message
        if (errorMessage.includes('multiple')) {
          alert('Only one file can be uploaded at a time. For multiple files, please create a ZIP or 7Z archive.')
        }
      }
    },
  })

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden border-2 border-dashed border-black bg-black"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden z-50"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.7z"
        />
        <div className="absolute inset-0 bg-black">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-black text-base">
            Upload file
          </p>
          <p className="relative z-20 font-sans font-normal text-black text-base mt-2">
            Drag or drop your file here or click to upload
          </p>
          <p className="relative z-20 font-sans font-normal text-black text-sm mt-1">
            Only PDF, DOC, DOCX, image files, ZIP, and 7Z files are allowed (Max 25MB)
          </p>
          <p className="relative z-20 font-sans font-normal text-black text-xs mt-1 text-center">
            <span className="text-yellow-400">⚠️</span> Only one file at a time. For multiple files, create a ZIP or 7Z archive.
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-black border border-gray-700 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-gray-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-gray-300 bg-gray-800"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-gray-400">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1 py-0.5 rounded-md bg-gray-800"
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-black border border-gray-700 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.3)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-300 flex flex-col items-center"
                  >
                    Drop it
                    <Upload className="h-4 w-4 text-gray-300" />
                  </motion.p>
                ) : (
                  <Upload className="h-4 w-4 text-gray-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-blue-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function TeacherDashboard() {
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    semester: "",
    subjectCombo: "",
    subject: "",
    type: "",
    description: "",
    file: null as File | null,
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [uploads, setUploads] = useState<any[]>([])
  const [loadingUploads, setLoadingUploads] = useState(true)
  const [deletingUploads, setDeletingUploads] = useState<Set<string>>(new Set())
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [showLogoutReminder, setShowLogoutReminder] = useState(false)
  const { toast } = useToast()

  // Fetch teacher's uploads on component mount
  useEffect(() => {
    fetchTeacherUploads()
  }, [])

  const fetchTeacherUploads = async () => {
    if (!user?.id) return
    
    setLoadingUploads(true)
    const result = await getTeacherUploads(user.id)
    if (result.success) {
      setUploads(result.data)
    } else {
      toast({
        title: "Error",
        description: "Failed to load uploads: " + result.error,
        variant: "destructive"
      })
    }
    setLoadingUploads(false)
  }

  const handleDeleteUpload = async (uploadId: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to delete uploads",
        variant: "destructive"
      })
      return
    }

    // Add to deleting set to show loading state
    setDeletingUploads(prev => new Set(prev).add(uploadId))

    try {
      const result = await deleteUpload(uploadId, user.id)
      
      if (result.success) {
        toast({
          title: "Upload Deleted",
          description: "Your upload has been deleted successfully",
        })
        
        // Remove from uploads list
        setUploads(prev => prev.filter(upload => upload.id !== uploadId))
      } else {
        toast({
          title: "Delete Failed",
          description: result.error || "Failed to delete upload",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Delete Failed",
        description: "An unexpected error occurred while deleting",
        variant: "destructive"
      })
    } finally {
      // Remove from deleting set
      setDeletingUploads(prev => {
        const newSet = new Set(prev)
        newSet.delete(uploadId)
        return newSet
      })
    }
  }

  const handleDeleteClick = (uploadId: string) => {
    setDeleteConfirmId(uploadId)
  }

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await handleDeleteUpload(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
    
    // Reset dependent fields when year changes
    if (field === "year") {
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        semester: "",
        subjectCombo: "",
        subject: ""
      }))
    }
    
    // Reset subject when subjectCombo changes
    if (field === "subjectCombo") {
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        subject: ""
      }))
    }
  }

  const handleFileChange = (files: File[]) => {
    const file = files[0] || null
    
    // Enhanced file validation
    if (file) {
      const validTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 
        'image/png', 
        'image/gif',
        'application/zip', 
        'application/x-7z-compressed',
        'application/x-zip-compressed'
      ]
      
      const maxSize = 25 * 1024 * 1024 // 25MB
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, file: 'Invalid file type. Only PDF, DOC, DOCX, images, ZIP, and 7Z files are allowed.' }))
        return
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, file: 'File size must be under 25MB.' }))
        return
      }
      
      // Clear file error if validation passes
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: '' }))
      }
    }
    
    setFormData((prev) => ({ ...prev, file }))
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    // Enhanced validation with better error messages
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long"
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters"
    }
    
    if (!formData.year) newErrors.year = "Year is required"
    
    if (formData.year === "1") {
      if (!formData.subjectCombo) newErrors.subjectCombo = "Subject combination is required for 1st year"
    } else if (formData.year && formData.year !== "1") {
      if (!formData.semester) newErrors.semester = "Semester is required for this year"
    }
    
    if (!formData.subject) newErrors.subject = "Subject is required"
    if (!formData.type) newErrors.type = "Type (Notes/Assignment) is required"
    
    if (!formData.file) {
      newErrors.file = "File is required"
    } else {
      // Re-validate file if present
      const validTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 
        'image/png', 
        'image/gif',
        'application/zip', 
        'application/x-7z-compressed',
        'application/x-zip-compressed'
      ]
      
      if (!validTypes.includes(formData.file.type)) {
        newErrors.file = 'Invalid file type. Only PDF, DOC, DOCX, images, ZIP, and 7Z files are allowed.'
      } else if (formData.file.size > 25 * 1024 * 1024) {
        newErrors.file = 'File size must be under 25MB.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadWithRetry = async (uploadData: UploadData, maxRetries = 3): Promise<any> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setUploadStatus(`Uploading file... (Attempt ${attempt}/${maxRetries})`)
        setUploadProgress(20 * attempt)
        
        // Upload file to storage
        const uploadResult = await uploadFile(uploadData)
        
        if (!uploadResult.success) {
          if (attempt === maxRetries) {
            throw new Error(uploadResult.error || "Failed to upload file")
          }
          continue
        }
        
        setUploadStatus("Saving upload record...")
        setUploadProgress(80)
        
        // Save upload record to database
        const saveResult = await saveUploadRecord(uploadData, uploadResult)
        
        if (!saveResult.success) {
          if (attempt === maxRetries) {
            throw new Error("File uploaded but failed to save record: " + saveResult.error)
          }
          continue
        }
        
        setUploadProgress(100)
        setUploadStatus("Upload completed successfully!")
        return { success: true }
        
      } catch (error) {
        console.error(`Upload attempt ${attempt} failed:`, error)
        if (attempt === maxRetries) {
          throw error
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting",
        variant: "destructive"
      })
      return
    }

    if (!formData.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus("Preparing upload...")
    setRetryCount(0)

    try {
      // Prepare upload data
      const uploadData: UploadData = {
        title: formData.title.trim(),
        year: formData.year,
        semester: formData.semester,
        subjectCombo: formData.subjectCombo,
        subject: formData.subject,
        type: formData.type as 'Notes' | 'Assignment',
        description: formData.description.trim(),
        file: formData.file
      }

      await uploadWithRetry(uploadData)

      // Success
      toast({
        title: "Upload Successful",
        description: "Your file has been uploaded successfully and is now available to students",
      })

      // Show logout reminder
      setShowLogoutReminder(true)
      setTimeout(() => {
        setShowLogoutReminder(false)
      }, 7000)

      // Reset form
      setFormData({
        title: "",
        year: "",
        semester: "",
        subjectCombo: "",
        subject: "",
        type: "",
        description: "",
        file: null,
      })
      setErrors({})

      // Refresh uploads list
      await fetchTeacherUploads()

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during upload"
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setUploadStatus("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getSemesterOptions = (year: string) => {
    switch (year) {
      case "2":
        return ["3", "4"]
      case "3":
        return ["5", "6"]
      case "4":
        return ["7", "8"]
      default:
        return []
    }
  }

  const getSubjectComboOptions = () => {
    return [
      "Physics and PPS",
      "Chemistry and Civil"
    ]
  }

  const getSubjectOptions = (subjectCombo: string, year: string, semester: string) => {
    if (formData.year === "1" && formData.subjectCombo) {
      if (subjectCombo === "Physics and PPS") {
        return [
          "Physics",
          "PPS", 
          "Human Values",
          "Mathematics (Common)",
          "BEE"
        ]
      } else if (subjectCombo === "Chemistry and Civil") {
        return [
          "Chemistry",
          "Civil",
          "Communication Skill",
          "Mathematics",
          "Mechanical"
        ]
      }
    } else if (year === "2") {
      if (semester === "3") {
        return [
          "OOPS",
          "DSA",
          "Advanced Mathematics",
          "Digital Electronics",
          "MEFA",
          "Software Engineering"
        ]
      } else if (semester === "4") {
        return [
          "Java Programming",
          "Discrete Mathematics",
          "Digital Logic Design",
          "DSA",
          "DBMS",
          "Technical Communication"
        ]
      }
    }
    
    // Default subjects for other years/semesters
    return [
      "Physics",
      "Chemistry", 
      "Mathematics",
      "Computer Science",
      "Mechanical",
      "Civil"
    ]
  }

  const { user, profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header with User Info */}
      <div className="mb-8 relative">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Teacher Upload Portal</h1>
            <p className="text-gray-400">Upload and manage your educational materials</p>
          </div>
          
          {/* User Info Display */}
          <div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white font-medium">
                  {profile?.full_name || user?.user_metadata?.full_name || user?.email || "Guest"}
                </p>
                <p className="text-gray-400 text-sm">
                  {user?.email || "Not logged in"}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={profile?.full_name || user?.email || "User"} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {(profile?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-default">
                  <User className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{profile?.full_name || user?.user_metadata?.full_name || "User"}</span>
                    <span className="text-sm text-gray-400">{user?.email}</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={signOut}
                  className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Upload className="w-5 h-5" />
              <span>Upload New Document</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-white">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter document title"
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="year" className="text-white">Year *</Label>
                <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem className="text-white" value="1">1st Year</SelectItem>
                    <SelectItem className="text-white" value="2">2nd Year</SelectItem>
                    <SelectItem className="text-white" value="3">3rd Year</SelectItem>
                    <SelectItem className="text-white" value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
                {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
              </div>

              {/* Show semester only for 2nd, 3rd, 4th year */}
              {formData.year && formData.year !== "1" && (
                <div>
                  <Label htmlFor="semester" className="text-white">Semester *</Label>
                  <Select 
                    value={formData.semester} 
                    onValueChange={(value) => handleInputChange("semester", value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {getSemesterOptions(formData.year).map(sem => (
                        <SelectItem className="text-white" key={sem} value={sem}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.semester && <p className="text-red-400 text-sm mt-1">{errors.semester}</p>}
                </div>
              )}

              {/* Show subject combination only for 1st year */}
              {formData.year === "1" && (
                <div>
                  <Label htmlFor="subjectCombo" className="text-white">Subject Combination *</Label>
                  <Select value={formData.subjectCombo} onValueChange={(value) => handleInputChange("subjectCombo", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select combination" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {getSubjectComboOptions().map(combo => (
                        <SelectItem className="text-white" key={combo} value={combo}>{combo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subjectCombo && <p className="text-red-400 text-sm mt-1">{errors.subjectCombo}</p>}
                </div>
              )}

              {/* Show subject selection */}
              <div>
                <Label htmlFor="subject" className="text-white">Subject *</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => handleInputChange("subject", value)}
                  disabled={
                    !formData.year || 
                    (formData.year === "1" && !formData.subjectCombo) ||
                    (formData.year !== "1" && !formData.semester)
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder={
                      !formData.year 
                        ? "Select year first" 
                        : formData.year === "1" && !formData.subjectCombo
                        ? "Select subject combination first"
                        : formData.year !== "1" && !formData.semester
                        ? "Select semester first"
                        : "Select subject"
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {formData.year === "1" && formData.subjectCombo ? (
                      // Show specific subjects based on combination for 1st year
                      getSubjectOptions(formData.subjectCombo, formData.year, formData.semester).map(subject => (
                        <SelectItem className="text-white" key={subject} value={subject}>{subject}</SelectItem>
                      ))
                    ) : formData.year && ((formData.year === "1" && formData.subjectCombo) || (formData.year !== "1" && formData.semester)) ? (
                      // Show subjects for other years when semester is selected
                      getSubjectOptions(formData.subjectCombo, formData.year, formData.semester).map(subject => (
                        <SelectItem className="text-white" key={subject} value={subject}>{subject}</SelectItem>
                      ))
                    ) : (
                      // Show disabled state
                      <SelectItem className="text-gray-500" value="disabled" disabled>
                        {!formData.year 
                          ? "Please select year first" 
                          : formData.year === "1" && !formData.subjectCombo
                          ? "Please select subject combination first"
                          : formData.year !== "1" && !formData.semester
                          ? "Please select semester first"
                          : "No subjects available"
                        }
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div>
                <Label htmlFor="type" className="text-white">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem className="text-white" value="Notes">Notes</SelectItem>
                    <SelectItem className="text-white" value="Assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter a brief description (optional)"
                  rows={3}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="file" className="text-white">Upload Document *</Label>
                <FileUpload onChange={handleFileChange} />
                {errors.file && <p className="text-red-400 text-sm mt-1">{errors.file}</p>}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{uploadStatus}</span>
                    <span className="text-gray-300">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed" 
                size="lg"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploadStatus || "Uploading..."}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Previous Uploads */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <FileText className="w-5 h-5" />
              <span>Your Uploads</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUploads ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-400">Loading uploads...</span>
              </div>
            ) : uploads.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No uploads yet</p>
                <p className="text-gray-500 text-sm">Your uploaded documents will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{upload.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(upload.created_at).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Approved
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Year: {upload.year} • Subject: {upload.subject} • Type: {upload.type}</p>
                          {upload.description && <p>Description: {upload.description}</p>}
                          <p>File: {upload.file_name} ({(upload.file_size / 1024 / 1024).toFixed(2)} MB)</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {upload.download_url && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-blue-400 hover:text-blue-300 border-gray-600 hover:bg-black"
                            onClick={() => window.open(upload.download_url, '_blank')}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-black"
                          onClick={() => handleDeleteClick(upload.id)}
                          disabled={deletingUploads.has(upload.id)}
                          title="Delete upload"
                        >
                          {deletingUploads.has(upload.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Delete Upload</h3>
                <p className="text-sm text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this upload? This will permanently remove the file and cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={deletingUploads.has(deleteConfirmId)}
              >
                {deletingUploads.has(deleteConfirmId) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Reminder Popup */}
      {showLogoutReminder && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 max-w-sm border border-blue-500">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">Best Experience Reminder</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Please log out after uploading to experience the best experience.
                  <br />
                  <span className="font-medium text-white">PLEASE CLICK ON PROFILE TO LOGOUT</span>
                </p>
              </div>
              <button
                onClick={() => setShowLogoutReminder(false)}
                className="flex-shrink-0 text-blue-200 hover:text-white transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
