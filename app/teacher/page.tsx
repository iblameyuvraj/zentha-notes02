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
    title: "Data Mining PYQ Collection",
    type: "Previous Year",
    dateUploaded: "2024-01-12",
    status: "Pending",
  },
  {
    id: 3,
    title: "Machine Learning Midterm",
    type: "Midterm",
    dateUploaded: "2024-01-10",
    status: "Approved",
  },
]

export function TeacherUpload() {
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    semester: "",
    subjectCombo: "",
    type: "",
    description: "",
    file: null as File | null,
    subject: "",
  })
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, file }))
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.dataTransfer.files[0] }))
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({
      title: "",
      year: "",
      semester: "",
      subjectCombo: "",
      type: "",
      description: "",
      file: null,
      subject: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSemesterOptions = (year: string) => {
    switch (year) {
      case "1":
        return [
          { value: "1st", label: "1st" },
          { value: "2nd", label: "2nd" },
        ];
      case "2":
        return [
          { value: "3rd", label: "3rd" },
          { value: "4th", label: "4th" },
        ];
      case "3":
        return [
          { value: "5th", label: "5th" },
          { value: "6th", label: "6th" },
        ];
      case "4":
        return [
          { value: "7th", label: "7th" },
          { value: "8th", label: "8th" },
        ];
      default:
        return [
          { value: "1st", label: "1st" },
          { value: "2nd", label: "2nd" },
          { value: "3rd", label: "3rd" },
          { value: "4th", label: "4th" },
          { value: "5th", label: "5th" },
          { value: "6th", label: "6th" },
          { value: "7th", label: "7th" },
          { value: "8th", label: "8th" },
        ];
    }
  };

  const getSubjectOptions = (subjectCombo: string) => {
    if (subjectCombo === "Physics and PPS") {
      return [
      
        { value: "Physics", label: "Physics" },
        { value: "PPS", label: "PPS (Programming)" },
        { value: "BEE", label: "BEE (Basic Electrical Engineering)" },
        { value: "Human Value", label: "Human Value" },
        { value: "Mathes", label: "Mathes" },
      ];
    } else if (subjectCombo === "Chemistry and Civil") {
      return [
        { value: "Chemistry", label: "Chemistry" },
        { value: "Civil", label: "Civil" },
        { value: "Communication", label: "Communication" },
        { value: "Mechanical", label: "Mechanical" },
        { value: "Mathes", label: "Mathes" },
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      <div className="absolute top-4 right-4 bg-neutral-800 bg-opacity-80 text-white text-xs px-3 py-1 rounded shadow-sm z-10">
        Logged in by <span className="font-semibold">teacher@example.com</span>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Teacher Upload Portal</h1>
        <p className="text-gray-400">Upload and manage your educational materials</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-white" />
              <span className="text-white">Upload New Document</span>
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
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year" className="text-white">Year *</Label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                    <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white">
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester" className="text-white">Semester *</Label>
                  <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)} disabled={!formData.year}>
                    <SelectTrigger className={`bg-neutral-800 border-neutral-700 text-white ${!formData.year ? 'opacity-50 cursor-not-allowed' : ''}`}> 
                      <SelectValue placeholder={!formData.year ? "Select year first" : "Select semester"} />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white">
                      {getSemesterOptions(formData.year).map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(formData.year === "1" || formData.year === "2") && (formData.semester === "1st" || formData.semester === "2nd") && (
                <div>
                  <Label htmlFor="subjectCombo" className="text-white">Subject Combination *</Label>
                  <Select value={formData.subjectCombo} onValueChange={(value) => handleInputChange("subjectCombo", value)} disabled={!formData.semester}>
                    <SelectTrigger className={`bg-neutral-800 border-neutral-700 text-white ${!formData.semester ? 'opacity-50 cursor-not-allowed' : ''}`}> 
                      <SelectValue placeholder={!formData.semester ? "Select semester first" : "Select combination"} />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white">
                      <SelectItem value="Physics and PPS">Physics and PPS</SelectItem>
                      <SelectItem value="Chemistry and Civil">Chemistry and Civil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {/* Subject Dropdown */}
              {(formData.subjectCombo === "Physics and PPS" || formData.subjectCombo === "Chemistry and Civil") && (
                <div>
                  <Label htmlFor="subject" className="text-white">Subject *</Label>
                  <Select value={formData.subject || ""} onValueChange={(value) => handleInputChange("subject", value)} disabled={!formData.subjectCombo}>
                    <SelectTrigger className={`bg-neutral-800 border-black-700 text-white ${!formData.subjectCombo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <SelectValue placeholder={!formData.subjectCombo ? "Select combination first" : "Select subject"} />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 text-white">
                      {getSubjectOptions(formData.subjectCombo).map(opt => (
                        <SelectItem className="bg-black text-white"key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="type" className="text-white">Type *</Label>
                <Select value={formData.type || "Notes"} onValueChange={(value) => handleInputChange("type", value)} disabled={((formData.year === "1" || formData.year === "2") && (formData.semester === "1st" || formData.semester === "2nd") && !formData.subjectCombo) || (!formData.semester)}>
                  <SelectTrigger className={`bg-neutral-800 border-neutral-700 text-white ${(((formData.year === "1" || formData.year === "2") && (formData.semester === "1st" || formData.semester === "2nd") && !formData.subjectCombo) || (!formData.semester)) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder="Notes" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white">
                    <SelectItem value="Notes">Notes</SelectItem>
                    <SelectItem value="Previous Year" disabled>Previous Year (soon)</SelectItem>
                    <SelectItem value="Midterm" disabled>Midterm (soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter a brief description (optional)"
                  rows={3}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-white"
                />
              </div>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-blue-500 bg-neutral-800' : 'border-neutral-700 bg-neutral-900'} cursor-pointer`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleButtonClick}
              >
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  ref={inputRef}
                  className="hidden"
                  required
                />
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 mb-2 text-blue-400" />
                  <span className="text-white">Drag & drop PDF or DOC file here, or click to select</span>
                  {formData.file && <p className="text-sm text-gray-400 mt-2">Selected: {formData.file.name}</p>}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full mt-4 border border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors"
                size="lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Previous Uploads */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-white" />
              <span className="text-white">Your Uploads</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="border border-neutral-800 rounded-lg p-4 bg-neutral-950 hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">{upload.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {upload.dateUploaded}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>{upload.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm" className="text-red-400 hover:text-red-500 bg-transparent border border-neutral-700">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-400 hover:text-red-500 bg-transparent border border-neutral-700">
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
      <div className="w-full flex justify-center mt-12">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-8 py-6 shadow-lg flex items-center justify-center">
          <h2 className="text-2xl font-bold text-black-400 text-center">Attendance feature coming soon 
        <br /> <p className="text-sm text-gray-400 text-center">facing any issues? contact us at <a href="mailto:hi@zentha.in" className="text-blue-400 hover:text-blue-500">hi@zentha.in</a></p></h2>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return <TeacherUpload />
}
