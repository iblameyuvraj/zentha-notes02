"use client"

import { useState } from "react"
import { Eye, EyeOff, User, Mail, Lock, Calendar, LogOut, Trash2, Moon, Sun, Bell, Download, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  // Use real user data from auth context
  const userData = {
    name: profile?.full_name || user?.user_metadata?.full_name || "User",
    email: user?.email || profile?.email || "",
    role: profile?.role || "student",
    year: profile?.year ? `${profile.year}st year` : "1st year",
    semester: profile?.semester ? `${profile.semester}st` : "1st",
    subjectCombination: profile?.subject_combo === 'physics' ? 'Physics & PPS' : 'Chemistry & Civil',
    createdAt: profile?.created_at || "",
    lastLogin: profile?.last_login || "",
    totalDownloads: profile?.total_downloads || 0
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setShowLogoutDialog(false);
    await signOut();
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = async () => {
    setDeleting(true);
    try {
      // Delete user account from Supabase
      const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
      if (error) {
        console.error('Error deleting account:', error);
      }
      setDeleting(false);
      setShowDeleteDialog(false);
      await signOut();
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage Account & App Preferences</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <User className="w-5 h-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input id="name" value={userData.name} readOnly className="mt-1 bg-gray-700 border-gray-600 text-white cursor-not-allowed" />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="email" type="email" value={userData.email} readOnly className="pl-10 bg-gray-700 border-gray-600 text-white cursor-not-allowed" />
              </div>
            </div>
            <div>
              <Label htmlFor="role" className="text-white">Role</Label>
              <Input id="role" value={userData.role} readOnly className="mt-1 bg-gray-700 border-gray-600 text-white cursor-not-allowed" />
            </div>
            <div>
              <Label htmlFor="year" className="text-white">Year</Label>
              <Input id="year" value={userData.year} readOnly className="mt-1 bg-gray-700 border-gray-600 text-white cursor-not-allowed" />
            </div>
            <div>
              <Label htmlFor="semester" className="text-white">Semester</Label>
              <Input id="semester" value={userData.semester} readOnly className="mt-1 bg-gray-700 border-gray-600 text-white cursor-not-allowed" />
            </div>
            {userData.subjectCombination && (
              <div>
                <Label htmlFor="subjectCombination" className="text-white">Subject Combination</Label>
                <Input id="subjectCombination" value={userData.subjectCombination} readOnly className="mt-1 bg-gray-700 border-gray-600 text-white cursor-not-allowed" />
              </div>
            )}
            <p className="text-sm text-gray-400 mt-1">Contact admin to change your info. <br /> <a href="mailto:hi@zentha.in" className="text-blue-400 hover:text-blue-300">hi@zentha.in</a></p>
          </CardContent>
        </Card>
        {/* App Preferences */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">App Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <Label htmlFor="notifications" className="text-base font-medium text-white">Notifications</Label>
                  <p className="text-sm text-gray-400">Receive email notifications for new zentha notes</p>
                </div>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
            
            {/* Buy us a Coffee Section */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black border border-neutral-700/50 p-6 shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.02)_50%,transparent_70%)]"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Coffee Icon Container */}
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-neutral-700 via-neutral-600 to-neutral-500 rounded-full shadow-lg border border-neutral-600/50">
                    <Coffee className="w-6 h-6 text-neutral-200" />
                  </div>
                  
                  {/* Text Content */}
                  <div>
                    <Label className="text-lg font-semibold text-neutral-100 flex items-center">
                      Buy us a coffee
                      <span className="ml-2 text-neutral-400">☕</span>
                    </Label>
                    <p className="text-sm text-neutral-400 mt-1">Support our development with a warm cup of coffee</p>
                  </div>
                </div>
                
                {/* Action Button */}
                <a 
                  href="https://buymeacoffee.com/zenthastudio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Button 
                    className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-600 hover:from-neutral-700 hover:via-neutral-600 hover:to-neutral-500 text-neutral-100 border border-neutral-600/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  >
                    <Coffee className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300 text-neutral-200" />
                    Support Us
                  </Button>
                </a>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-2 right-2 text-neutral-700/30 text-2xl">☕</div>
              <div className="absolute bottom-2 left-2 text-neutral-700/30 text-xl">☕</div>
              
              {/* Premium Accent Lines */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-600/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-600/50 to-transparent"></div>
            </div>
          </CardContent>
        </Card>
        {/* Account Metadata */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-white">Date Joined</span>
              </div>
              <span className="text-gray-400">{userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "-"}</span>
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-white">Last Login</span>
              </div>
              <span className="text-gray-400">{userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : "-"}</span>
            </div>
            <Separator className="bg-gray-700" />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-gray-400" />
                <span className="text-white">Total Downloads</span>
              </div>
              <span className="text-gray-400">{userData.totalDownloads ?? 0} files</span>
            </div>
          </CardContent>
        </Card>
        {/* Account Actions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start bg-transparent border-gray-600 text-white hover:bg-gray-700">
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
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Confirm Logout</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Are you sure you want to logout?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={confirmLogout} variant="outline" className="border-gray-600 text-black hover:bg-gray-700">
                    Logout
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" className="border-gray-600 text-black hover:bg-gray-700">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Delete Account</DialogTitle>
                  <DialogDescription className="text-gray-400">
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
                    <Button variant="outline" className="border-gray-600 text-black hover:bg-gray-700">Cancel</Button>
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
