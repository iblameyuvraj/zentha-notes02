"use client"

import { useState } from "react"
import { Download, Filter, FileText, Calendar, BookOpen, GraduationCap, Moon, Sun, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// RTU Papers data
const rtuPapers = [
  // Syllabus
  {
    id: 1,
    title: "1st Year Syllabus",
    subject: "Syllabus",
    semester: "All Semesters",
    year: "2024-2025",
    type: "Syllabus",
    filename: "1st year syllabus.pdf",
    filepath: "/1st-year/syllabus/1st year syllabus.pdf"
  },
  // Chemistry Papers
  {
    id: 2,
    title: "RTU Chemistry 2023-2024 Semester I",
    subject: "Chemistry",
    semester: "1st Semester",
    year: "2023-2024",
    type: "Previous Year",
    filename: "2023-2024 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU CHEMISTRY/2023-2024 SEM-I.pdf"
  },
  {
    id: 3,
    title: "RTU Chemistry 2023-2024 Semester II",
    subject: "Chemistry",
    semester: "2nd Semester",
    year: "2023-2024",
    type: "Previous Year",
    filename: "2023-2024 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU CHEMISTRY/2023-2024 SEM-II.pdf"
  },
  {
    id: 4,
    title: "RTU Chemistry 2022-2023 Semester I",
    subject: "Chemistry",
    semester: "1st Semester",
    year: "2022-2023",
    type: "Previous Year",
    filename: "2022-2023 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU CHEMISTRY/2022-2023 SEM-I.pdf"
  },
  {
    id: 5,
    title: "RTU Chemistry 2022-2023 Semester II",
    subject: "Chemistry",
    semester: "2nd Semester",
    year: "2022-2023",
    type: "Previous Year",
    filename: "2022-2023 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU CHEMISTRY/2022-2023 SEM-II.pdf"
  },
  {
    id: 6,
    title: "RTU Chemistry 2021-2022 Semester I",
    subject: "Chemistry",
    semester: "1st Semester",
    year: "2021-2022",
    type: "Previous Year",
    filename: "2021-2022 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU CHEMISTRY/2021-2022 SEM-I.pdf"
  },
  {
    id: 7,
    title: "RTU Chemistry 2021-2022 Semester II",
    subject: "Chemistry",
    semester: "2nd Semester",
    year: "2021-2022",
    type: "Previous Year",
    filename: "2021-2022 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU CHEMISTRY/2021-2022 SEM-II.pdf"
  },
  // Civil Engineering Papers
  {
    id: 8,
    title: "RTU Civil Engineering 2023-2024 Semester I",
    subject: "Civil Engineering",
    semester: "1st Semester",
    year: "2023-2024",
    type: "Previous Year",
    filename: "2023-2024 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU-CiViL/2023-2024 SEM-I.pdf"
  },
  {
    id: 9,
    title: "RTU Civil Engineering 2023-2024 Semester II",
    subject: "Civil Engineering",
    semester: "2nd Semester",
    year: "2023-2024",
    type: "Previous Year",
    filename: "2023-2024 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU-CiViL/2023-2024 SEM-II.pdf"
  },
  {
    id: 10,
    title: "RTU Civil Engineering 2022-2023 Semester I",
    subject: "Civil Engineering",
    semester: "1st Semester",
    year: "2022-2023",
    type: "Previous Year",
    filename: "2022-2023 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU-CiViL/2022-2023 SEM-I.pdf"
  },
  {
    id: 11,
    title: "RTU Civil Engineering 2022-2023 Semester II",
    subject: "Civil Engineering",
    semester: "2nd Semester",
    year: "2022-2023",
    type: "Previous Year",
    filename: "2022-2023 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU-CiViL/2022-2023 SEM-II.pdf"
  },
  {
    id: 12,
    title: "RTU Civil Engineering 2021-2022 Semester I",
    subject: "Civil Engineering",
    semester: "1st Semester",
    year: "2021-2022",
    type: "Previous Year",
    filename: "2021-2022 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU-CiViL/2021-2022 SEM-I.pdf"
  },
  {
    id: 13,
    title: "RTU Civil Engineering 2021-2022 Semester II",
    subject: "Civil Engineering",
    semester: "2nd Semester",
    year: "2021-2022",
    type: "Previous Year",
    filename: "2021-2022 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU-CiViL/2021-2022 SEM-II.pdf"
  },
  // Mathematics Papers
  {
    id: 14,
    title: "RTU Mathematics 2023-2024",
    subject: "Mathematics",
    semester: "All Semesters",
    year: "2023-2024",
    type: "Previous Year",
    filename: "2023-2024.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU MATHAMATICS /2023-2024.pdf"
  },
  {
    id: 15,
    title: "RTU Mathematics 2022-2023",
    subject: "Mathematics",
    semester: "All Semesters",
    year: "2022-2023",
    type: "Previous Year",
    filename: "2022-2023.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU MATHAMATICS /2022-2023.pdf"
  },
  {
    id: 16,
    title: "RTU Mathematics 2021-2022",
    subject: "Mathematics",
    semester: "All Semesters",
    year: "2021-2022",
    type: "Previous Year",
    filename: "2021-2022.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU MATHAMATICS /2021-2022.pdf"
  },
  // Mechanical Engineering Papers
  {
    id: 17,
    title: "RTU Mechanical Engineering 2023-2024 Semester I",
    subject: "Mechanical Engineering",
    semester: "1st Semester",
    year: "2023-2024",
    type: "Previous Year",
    filename: "2023-2024 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU MECHANICAL/2023-2024 SEM-I.pdf"
  },
  {
    id: 18,
    title: "RTU Mechanical Engineering 2023-2024 Semester II",
    subject: "Mechanical Engineering",
    semester: "2nd Semester",
    year: "2023-2024",
    type: "Previous Year",
    filename: "2023-2024 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU MECHANICAL/2023-2024 SEM-II.pdf"
  },
  {
        id: 19,
    title: "RTU Mechanical Engineering 2022-2023 Semester I",
    subject: "Mechanical Engineering",
    semester: "1st Semester",
    year: "2022-2023",
    type: "Previous Year",
    filename: "2022-2023 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU MECHANICAL/2022-2023 SEM-I.pdf"
  },
  {
    id: 20,
    title: "RTU Mechanical Engineering 2022-2023 Semester II",
    subject: "Mechanical Engineering",
    semester: "2nd Semester",
    year: "2022-2023",
    type: "Previous Year",
    filename: "2022-2023 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU MECHANICAL/2022-2023 SEM-II.pdf"
  },
  {
    id: 21,
    title: "RTU Mechanical Engineering 2021-2022 Semester I",
    subject: "Mechanical Engineering",
    semester: "1st Semester",
    year: "2021-2022",
    type: "Previous Year",
    filename: "2021-2022 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU MECHANICAL/2021-2022 SEM-I.pdf"
  },
  {
    id: 22,
    title: "RTU Mechanical Engineering 2021-2022 Semester II",
    subject: "Mechanical Engineering",
    semester: "2nd Semester",
    year: "2021-2022",
    type: "Previous Year",
    filename: "2021-2022 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU MECHANICAL/2021-2022 SEM-II.pdf"
  },
  // Communication Skills Papers
  {
    id: 23,
    title: "RTU Communication Skills 2023-2024 Semester I",
    subject: "Communication Skills",
    semester: "1st Semester",
    year: "2023-2024",
    type: "Previous Year",
    filename: "2023-2024 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU COMMUNICATION  SKILL/2023-2024 SEM-I.pdf"
  },
  {
    id: 24,
    title: "RTU Communication Skills 2023-2024 Semester II",
    subject: "Communication Skills",
    semester: "2nd Semester",
    year: "2023-2024",
    type: "Previous Year",
    filename: "2023-2024 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU COMMUNICATION  SKILL/2023-2024 SEM-II.pdf"
  },
  {
    id: 25,
    title: "RTU Communication Skills 2022-2023 Semester I",
    subject: "Communication Skills",
    semester: "1st Semester",
    year: "2022-2023",
    type: "Previous Year",
    filename: "2022-2023 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU COMMUNICATION  SKILL/2022-2023 SEM-I.pdf"
  },
  {
    id: 26,
    title: "RTU Communication Skills 2022-2023 Semester II",
    subject: "Communication Skills",
    semester: "2nd Semester",
    year: "2022-2023",
    type: "Previous Year",
    filename: "2022-2023 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU COMMUNICATION  SKILL/2022-2023 SEM-II.pdf"
  },
  {
    id: 27,
    title: "RTU Communication Skills 2021-2022 Semester I",
    subject: "Communication Skills",
    semester: "1st Semester",
    year: "2021-2022",
    type: "Previous Year",
    filename: "2021-2022 SEM-I.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU COMMUNICATION  SKILL/2021-2022 SEM-I.pdf"
  },
  {
    id: 28,
    title: "RTU Communication Skills 2021-2022 Semester II",
    subject: "Communication Skills",
    semester: "2nd Semester",
    year: "2021-2022",
    type: "Previous Year",
    filename: "2021-2022 SEM-II.pdf",
    filepath: "/1st-year/chemistry/PYQ/RTU COMMUNICATION  SKILL/2021-2022 SEM-II.pdf"
  }
]
// end of pyq 



// starting of midterms
// end of midterms



// database call for nots 
// end of database call for nots 


export default function StudentDashboard() {
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [semesterFilter, setSemesterFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [darkMode, setDarkMode] = useState(true)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const router = useRouter()

  const filteredFiles = rtuPapers.filter((file: any) => {
    const matchesSubject = subjectFilter === "all" || file.subject === subjectFilter
    const matchesSemester = semesterFilter === "all" || file.semester === semesterFilter
    const matchesType = typeFilter === "all" || file.type === typeFilter
    const matchesYear = yearFilter === "all" || file.year === yearFilter

    return matchesSubject && matchesSemester && matchesType && matchesYear
  })

  const clearAllFilters = () => {
    setSubjectFilter("all")
    setSemesterFilter("all")
    setTypeFilter("all")
    setYearFilter("all")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Notes":
        return <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case "Previous Year":
        return <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
      case "Midterm":
        return <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      case "Syllabus":
        return <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      default:
        return <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Notes":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Previous Year":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Midterm":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "Syllabus":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const handleDownload = (filepath: string, filename: string) => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a')
    link.href = filepath
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAskChatGPT = (file: any) => {
    setSelectedFile(file)
    setShowAIDialog(true)
  }

  const handleConfirmAI = () => {
    if (selectedFile) {
      // Download the file first
      handleDownload(selectedFile.filepath, selectedFile.filename)
      
      // Create a ChatGPT prompt with file information
      const prompt = `I need help understanding the "${selectedFile.title} (${selectedFile.semester}, ${selectedFile.year})" question paper. I am uploading the file to you and you will help me to understand the questions and answer of the questions.`
      
      // Encode the prompt for URL
      const encodedPrompt = encodeURIComponent(prompt)
      
      // Close dialog and redirect to ChatGPT with the prompt
      setShowAIDialog(false)
      setSelectedFile(null)
      window.open(`https://chat.openai.com/?prompt=${encodedPrompt}`, '_blank')
    }
  }

  return (
    <div className={darkMode ? "dark min-h-screen bg-black dark:bg-gray-900" : "min-h-screen bg-black"}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-100 mb-2">RTU Papers</h1>
            <p className="text-gray-600 dark:text-gray-300">Access Previous Year Question Papers</p>
          </div>
        </div>
        
        {/* Settings button */}
        <div className="absolute top-6 right-4 z-20">
          <button
            className="rounded-full p-3 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
            aria-label="Open Settings"
            onClick={() => router.push("/settings")}
          >
            <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-black dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-white dark:text-gray-100">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                <SelectItem value="Communication Skills">Communication Skills</SelectItem>
              </SelectContent>
            </Select>

            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
                <SelectItem value="all">All Semesters</SelectItem>
                <SelectItem value="1st Semester">1st Semester</SelectItem>
                <SelectItem value="2nd Semester">2nd Semester</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Previous Year">Previous Year</SelectItem>
                <SelectItem value="Midterm">Midterm</SelectItem>
                <SelectItem value="Notes">Notes</SelectItem>
                <SelectItem value="Syllabus">Syllabus</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 dark:text-gray-100">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2022-2023">2022-2023</SelectItem>
                <SelectItem value="2021-2022">2021-2022</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
              className="bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-600"
            >
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredFiles.length} of {rtuPapers.length} documents
          </p>
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <Card
              key={file.id}
              className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(file.type)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(file.type)}`}>
                      {file.type}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight text-gray-900 dark:text-gray-100">{file.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {file.subject}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    {file.semester} • {file.year}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    size="sm"
                    onClick={() => handleDownload(file.filepath, file.filename)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1" 
                    size="sm"
                    onClick={() => handleAskChatGPT(file)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask ChatGPT
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No documents found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters or search terms.</p>
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
                    <li>• The AI will help you with the question paper</li>
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
    </div>
  )
}
