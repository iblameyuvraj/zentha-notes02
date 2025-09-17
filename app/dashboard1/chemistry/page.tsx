"use client"

import { useState } from "react"
import { Filter, FileText, Calendar, BookOpen, GraduationCap, Moon, Sun, Eye } from "lucide-react"
import PDFViewerNew from "@/components/ui/pdf-viewer-new"
import midtermPapers from "./sem1-json/midterm.json"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon } from "lucide-react"
import { useRouter } from "next/navigation"
 
import UploadedContentChemistry from "@/components/ui/uploaded-content-chemistry"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

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


export default function StudentDashboard() {
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [semesterFilter, setSemesterFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [darkMode, setDarkMode] = useState(true)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const router = useRouter()

  const allPapers = [...rtuPapers, ...midtermPapers]

  const filteredFiles = allPapers.filter((file: any) => {
    const matchesSubject = subjectFilter === "all" || file.subject === subjectFilter
    const matchesSemester = semesterFilter === "all" || file.semester === semesterFilter
    const matchesType = typeFilter === "all" || file.type === typeFilter
    const matchesYear = yearFilter === "all" || file.year === yearFilter

    return matchesSubject && matchesSemester && matchesType && matchesYear
  })

  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access this page</h1>
          <p>You need to be authenticated to view this content.</p>
        </div>
      </div>
    );
  }

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

  

  const handleViewPdf = (file: any) => {
    if (!user) {
      toast.error("Please log in to view PDFs")
      return
    }
    setPdfUrl(file.filepath)
  }

  return (
    <div className={darkMode ? "dark min-h-screen bg-black dark:bg-gray-900" : "min-h-screen bg-black"}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-gray-100 mb-2">Chemistry Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Access RTU Papers and Teacher Uploads</p>
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

        {/* Tabs */}
        <Tabs defaultValue="rtu-papers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 dark:bg-gray-700">
            <TabsTrigger value="rtu-papers" className="text-white">RTU Papers</TabsTrigger>
            <TabsTrigger value="uploaded-content" className="text-white">Teacher Uploads</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rtu-papers" className="mt-6">
            {/* RTU Papers Content */}
            <div className="space-y-6">
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
                  Showing {filteredFiles.length} of {allPapers.length} documents
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
                          variant="outline" 
                          className="flex-1" 
                          size="sm"
                          onClick={() => handleViewPdf(file)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View PDF
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
            </div>
          </TabsContent>
          
          <TabsContent value="uploaded-content" className="mt-6">
            <UploadedContentChemistry />
          </TabsContent>
        </Tabs>

        {/* PDF Viewer */}
        {pdfUrl && (
          <PDFViewerNew 
            url={pdfUrl} 
            title="Document Viewer"
            onClose={() => setPdfUrl(null)}
          />
        )}

        
      </div>
    </div>
  )
}
