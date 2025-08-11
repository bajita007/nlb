"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Shield, Calendar, Save, Eye, EyeOff } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/components/ui/use-toast"

interface AdminProfile {
  id: string
  username: string
  fullName: string
  email: string
  role: string
  created_at: string
  last_login: string
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = () => {
    try {
      const adminUserData = localStorage.getItem("adminUser")
      const loginTime = localStorage.getItem("adminLoginTime")

      if (adminUserData) {
        const userData = JSON.parse(adminUserData)
        const profileData: AdminProfile = {
          ...userData,
          created_at: "2024-01-01T00:00:00Z", // Mock data
          last_login: loginTime || new Date().toISOString(),
        }
        setProfile(profileData)
        setFormData({
          fullName: profileData.fullName,
          email: profileData.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat profil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate password if changing
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Password baru dan konfirmasi tidak cocok",
            variant: "destructive",
          })
          return
        }
        if (formData.newPassword.length < 6) {
          toast({
            title: "Error",
            description: "Password baru minimal 6 karakter",
            variant: "destructive",
          })
          return
        }
      }

      // Update profile data
      if (profile) {
        const updatedProfile = {
          ...profile,
          fullName: formData.fullName,
          email: formData.email,
        }

        // Update localStorage
        localStorage.setItem("adminUser", JSON.stringify(updatedProfile))
        setProfile(updatedProfile)

        toast({
          title: "Berhasil",
          description: "Profil berhasil diperbarui",
        })

        setIsEditing(false)
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui profil",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat profil...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!profile) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Profil tidak ditemukan</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil Admin</h1>
          <p className="text-gray-600">Kelola informasi akun dan keamanan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg">{profile.fullName}</h3>
                  <p className="text-gray-600">@{profile.username}</p>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{profile.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      Bergabung {new Date(profile.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      Login terakhir {new Date(profile.last_login).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Edit Profil</CardTitle>
                  {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profil</Button>}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Informasi Dasar</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" value={profile.username} disabled className="bg-gray-50" />
                        <p className="text-xs text-gray-500 mt-1">Username tidak dapat diubah</p>
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={profile.role} disabled className="bg-gray-50" />
                      </div>
                      <div>
                        <Label htmlFor="fullName">Nama Lengkap</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Change */}
                  {isEditing && (
                    <div className="space-y-4 pt-6 border-t">
                      <h4 className="font-medium text-gray-900">Ubah Password (Opsional)</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">Password Saat Ini</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.currentPassword}
                              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                              placeholder="Masukkan password saat ini"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="newPassword">Password Baru</Label>
                            <Input
                              id="newPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.newPassword}
                              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                              placeholder="Password baru (minimal 6 karakter)"
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <Input
                              id="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              placeholder="Ulangi password baru"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-2 pt-6 border-t">
                      <Button type="submit" className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Simpan Perubahan
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            fullName: profile.fullName,
                            email: profile.email,
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          })
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Keamanan Akun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Status Login</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium text-green-600">Aktif</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sesi dimulai:</span>
                    <span className="text-sm">{new Date(profile.last_login).toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Keamanan</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Two-Factor Auth:</span>
                    <span className="text-sm text-gray-500">Tidak aktif</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Password terakhir diubah:</span>
                    <span className="text-sm text-gray-500">Tidak diketahui</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
