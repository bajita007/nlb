"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Calendar, Edit, Save, X, Shield } from "lucide-react"
import { UserLayout } from "@/components/user-layout"
import { useToast } from "@/components/ui/use-toast"
import { getUserSession } from "@/lib/auth"
import { updateUserProfile } from "@/app/actions/user-actions"

interface UserProfile {
  id: string
  name: string
  phone: string
  email?: string
  created_at: string
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = () => {
    try {
      const userSession = getUserSession()
      if (userSession) {
        const profileData = {
          id: userSession.id,
          name: userSession.full_name || "",
          phone: userSession.phone_number || "",
          email: userSession.email || "",
          created_at: userSession.created_at || new Date().toISOString(),
        }
        setProfile(profileData)
        setEditForm({
          name: profileData.name,
          phone: profileData.phone,
          email: profileData.email || "",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat profil pengguna",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        name: profile.name,
        phone: profile.phone,
        email: profile.email || "",
      })
    }
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!profile) return

    try {
      setIsSaving(true)

      const result = await updateUserProfile(profile.id, editForm)

      if (result.success) {
        // Update local storage
        const currentSession = getUserSession()
        if (currentSession) {
          const updatedSession = {
            ...currentSession,
            name: editForm.name,
            phone: editForm.phone,
            email: editForm.email,
          }
          localStorage.setItem("userSession", JSON.stringify(updatedSession))
        }

        setProfile((prev) => (prev ? { ...prev, ...editForm } : null))
        setIsEditing(false)
        toast({
          title: "Berhasil",
          description: "Profil berhasil diperbarui",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal memperbarui profil",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui profil",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") {
      return "U" // Default fallback for undefined/null names
    }
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat profil...</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  if (!profile) {
    return (
      <UserLayout>
        <div className="mx-auto p-4">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">Profil tidak ditemukan</p>
            </CardContent>
          </Card>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className=" mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {getInitials(profile.name || "User")}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{profile.name || "Nama tidak tersedia"}</CardTitle>
            <div className="flex justify-center">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Pengguna Aplikasi
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Informasi Profil</CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="Masukkan nomor telepon"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Opsional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="Masukkan email"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Batal
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Nomor Telepon</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>

                {profile.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Bergabung Sejak</p>
                    <p className="font-medium">{formatDate(profile.created_at)}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Keamanan Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Akun Terverifikasi</p>
                    <p className="text-sm text-green-600">Akun Anda telah diverifikasi oleh admin</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  )
}
