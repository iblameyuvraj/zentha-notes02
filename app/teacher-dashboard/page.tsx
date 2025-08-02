"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, FileText, Trash2, Edit, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useDropzone, FileRejection } from "react-dropzone"
import { cn } from "@/lib/utils"

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

export function GridPattern() {
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
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif', 'application/zip', 'application/x-7z-compressed']
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
    setFormData((prev) => ({ ...prev, file }))
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.year) newErrors.year = "Year is required"
    if (formData.year === "1") {
      if (!formData.subjectCombo) newErrors.subjectCombo = "Subject combination is required"
    } else {
      if (!formData.semester) newErrors.semester = "Semester is required"
    }
    if (!formData.subject) newErrors.subject = "Subject is required"
    if (!formData.type) newErrors.type = "Type is required"
    if (!formData.file) newErrors.file = "File is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    console.log("Form submitted:", formData)
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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Teacher Upload Portal</h1>
        <p className="text-gray-400">Upload and manage your educational materials</p>
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

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
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
            <div className="space-y-4">
              {mockUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">{upload.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {upload.dateUploaded}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                          {upload.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm" className="text-red-400  hover:text-red-300 border-gray-600 hover:bg-black">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-400  hover:text-red-300 border-gray-600 hover:bg-black">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
