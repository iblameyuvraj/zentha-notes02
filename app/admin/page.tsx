"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Check, X, Trash2, Users, FileText, Clock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@supabase/supabase-js'


const mockStats = {
  totalUploads: 1247,
  pendingApprovals: 23,
  totalUsers: 456,
  totalDownloads: 8934,
}

const mockFiles = [
  {
    id: 1,
    title: "Advanced Data Structures Notes",
    subject: "Computer Science",
    semester: "3rd Semester",
    year: "2024",
    type: "Notes",
    uploadedBy: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    dateUploaded: "2024-01-15",
    status: "Pending",
  },
  {
    id: 2,
    title: "Quantum Physics PYQ Collection",
    subject: "Physics",
    semester: "5th Semester",
    year: "2023",
    type: "Previous Year",
    uploadedBy: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    dateUploaded: "2024-01-14",
    status: "Approved",
  },
  {
    id: 3,
    title: "Organic Chemistry Midterm",
    subject: "Chemistry",
    semester: "4th Semester",
    year: "2024",
    type: "Midterm",
    uploadedBy: "Dr. Emily Davis",
    email: "emily.davis@university.edu",
    dateUploaded: "2024-01-13",
    status: "Pending",
  },
  {
    id: 4,
    title: "Linear Algebra Solutions",
    subject: "Mathematics",
    semester: "2nd Semester",
    year: "2024",
    type: "Notes",
    uploadedBy: "Prof. Robert Wilson",
    email: "robert.wilson@university.edu",
    dateUploaded: "2024-01-12",
    status: "Approved",
  },
]

    export default function AdminPanel() {
  useEffect(() => {
    document.documentElement.classList.add("dark")
    return () => document.documentElement.classList.remove("dark")
  }, [])
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("All Subjects")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [uid, setUid] = useState("")
  const [adminStatus, setAdminStatus] = useState<null | { success: boolean; message: string }>(null)

  const filteredFiles = mockFiles.filter((file) => {
    return (
      (file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (subjectFilter === "All Subjects" || file.subject === subjectFilter) &&
      (statusFilter === "All Status" || file.status === statusFilter) &&
      (typeFilter === "All Types" || file.type === typeFilter)
    )
  })

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

  const handleApprove = (id: number) => {
    console.log("Approve file:", id)
  }

  const handleReject = (id: number) => {
    console.log("Reject file:", id)
  }

  const handleDelete = (id: number) => {
    console.log("Delete file:", id)
  }

  return (
    <div className="p-6 bg-black text-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage All Uploads</p>
      </div>

      <div className="absolute top-4 right-4 bg-neutral-800 bg-opacity-80 text-white text-xs px-3 py-1 rounded shadow-sm z-10">
        Logged in by <span className="font-semibold">teacher@example.com</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#18181b]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Uploads</p>
                <p className="text-3xl font-bold text-gray-100">{mockStats.totalUploads.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#18181b]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending Approvals</p>
                <p className="text-3xl font-bold text-orange-500">{mockStats.pendingApprovals}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#18181b]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-green-500">{mockStats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#18181b]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Downloads</p>
                <p className="text-3xl font-bold text-purple-500">{mockStats.totalDownloads.toLocaleString()}</p>
              </div>
              <Download className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-[#18181b]">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-100">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search files or teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black text-gray-100 border-gray-700"
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="bg-black text-gray-100 border-gray-700">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent className="bg-[#18181b] text-gray-100">
                <SelectItem value="All Subjects">All Subjects</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-black text-gray-100 border-gray-700">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#18181b] text-gray-100">
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Notes">Notes</SelectItem>
                <SelectItem value="Previous Year">Previous Year</SelectItem>
                <SelectItem value="Midterm">Midterm</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-black text-gray-100 border-gray-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#18181b] text-gray-100">
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card className="bg-[#18181b]">
        <CardHeader>
          <CardTitle className="text-gray-100">All Uploads ({filteredFiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-100">File Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-100">Subject & Semester</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-100">Uploaded By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-100">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-100">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="border-b border-gray-800 hover:bg-[#232326]">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-100">{file.title}</p>
                        <p className="text-sm text-gray-400">
                          {file.type} • {file.year}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-100">{file.subject}</p>
                        <p className="text-sm text-gray-400">{file.semester}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-100">{file.uploadedBy}</p>
                        <p className="text-sm text-gray-400">{file.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-400">{file.dateUploaded}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)} bg-opacity-80`}> 
                        {file.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {file.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(file.id)}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(file.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(file.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
