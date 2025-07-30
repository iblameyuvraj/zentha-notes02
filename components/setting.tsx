"use client"

import { useState } from "react"
import { Eye, EyeOff, User, Mail, Lock, Calendar, LogOut, Trash2, Moon, Sun, Bell, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  // Mock user data
  const mockUser = {
    name: "Yuvraj Soni",
    email: "yuvraj@example.com",
    role: "student",
    year: "1st year",
    semester: "1st",
    subjectCombination: "Chemistry and Civil",
    createdAt: "2024-01-15T10:30:00Z",
    lastLogin: "2024-12-19T14:45:00Z",
    totalDownloads: 42
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    router.push("/");
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = async () => {
    setDeleting(true);
    // Simulate deletion process
    setTimeout(() => {
      setDeleting(false);
      setShowDeleteDialog(false);
      router.push("/");
    }, 2000);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage Account & App Preferences</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={mockUser.name} readOnly className="mt-1 bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="email" type="email" value={mockUser.email} readOnly className="pl-10 bg-gray-100 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={mockUser.role} readOnly className="mt-1 bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input id="year" value={mockUser.year} readOnly className="mt-1 bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <Label htmlFor="semester">Semester</Label>
              <Input id="semester" value={mockUser.semester} readOnly className="mt-1 bg-gray-100 cursor-not-allowed" />
            </div>
            {mockUser.subjectCombination && (
              <div>
                <Label htmlFor="subjectCombination">Subject Combination</Label>
                <Input id="subjectCombination" value={mockUser.subjectCombination} readOnly className="mt-1 bg-gray-100 cursor-not-allowed" />
              </div>
            )}
            <p className="text-sm text-gray-500 mt-1">Contact admin to change your info. <br /> <a href="mailto:hi@yuvraj.site" className="text-blue-500">hi@yuvraj.site</a></p>
          </CardContent>
        </Card>
        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>App Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <Label htmlFor="notifications" className="text-base font-medium">Notifications</Label>
                  <p className="text-sm text-gray-500">Receive app notifications</p>
                </div>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>
        {/* Account Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Date Joined</span>
              </div>
              <span className="text-gray-600">{mockUser.createdAt ? new Date(mockUser.createdAt).toLocaleDateString() : "-"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Last Login</span>
              </div>
              <span className="text-gray-600">{mockUser.lastLogin ? new Date(mockUser.lastLogin).toLocaleString() : "-"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">Total Downloads</span>
              </div>
              <span className="text-gray-600">{mockUser.totalDownloads ?? 0} files</span>
            </div>
          </CardContent>
        </Card>
        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="destructive"
              className="w-full justify-start"
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? "Deleting..." : "Delete Account"}
            </Button>
            
            {/* Logout Dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Logout</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to logout?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={confirmLogout} variant="outline">
                    Logout
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    Warning: Deleting your account will permanently remove all your data and cannot be undone.<br />
                    Are you sure you want to delete your account?<br />
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={confirmDeleteAccount}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
