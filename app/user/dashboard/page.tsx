"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Bell, User, Mail, Phone, Clock, FileText, BookOpen } from "lucide-react"
import { UserLayout } from "@/components/user-layout"
import { getUserSession, type UserSession } from "@/lib/auth"
import { getNotificationsForUser } from "@/app/actions/notification-actions"

interface UserNotification {
  id: string
  title: string
  message: string
  notification_type: string
  is_read: boolean
  created_at: string
  read_at: string | null
}

export default function UserDashboardPage() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const userSession = getUserSession()
    if (userSession) {
      setUser(userSession)
      loadNotifications(userSession.id)
    }
  }, [])

  const loadNotifications = async (userId: string) => {
    try {
      setLoading(true)
      const result = await getNotificationsForUser(userId)

      if (result.success) {
        setNotifications(result.data || [])
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal memuat notifikasi",
          variant: "destructive",
          id: ""
        })
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat notifikasi",
        variant: "destructive",
        id: ""
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat...</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Pengguna</h1>
          <p className="text-gray-600">Selamat datang, {user.full_name}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status Akun</p>
                  <p className="text-lg font-bold">{user.is_active ? "Aktif" : "Nonaktif"}</p>
                  <p className="text-xs text-gray-500">Sejak {new Date(user.created_at).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Posttest</p>
                  <p className="text-lg font-bold">Tersedia</p>
                  <p className="text-xs text-gray-500">Kuesioner evaluasi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notifikasi</p>
                  <p className="text-lg font-bold">{notifications.length}</p>
                  <p className="text-xs text-gray-500">{unreadCount} belum dibaca</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Media Edukasi</p>
                  <p className="text-lg font-bold">6</p>
                  <p className="text-xs text-gray-500">Materi tersedia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-teal-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.full_name}</p>
                  <p className="text-sm text-gray-600">Nama Lengkap</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.email}</p>
                  <p className="text-sm text-gray-600">Email</p>
                </div>
              </div>

              {user.phone_number && (
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.phone_number}</p>
                    <p className="text-sm text-gray-600">Nomor Telepon</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifikasi Terbaru
              </div>
              {unreadCount > 0 && <Badge variant="secondary">{unreadCount} baru</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">Belum ada notifikasi</p>
                <p className="text-gray-500 text-sm">Notifikasi dari administrator akan muncul di sini</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      notification.is_read ? "bg-gray-50 border-l-gray-300" : "bg-blue-50 border-l-blue-500 shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-medium ${notification.is_read ? "text-gray-700" : "text-blue-900"}`}>
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-2 w-2 mr-1" />
                          Baru
                        </Badge>
                      )}
                    </div>

                    <p className={`text-sm mb-2 ${notification.is_read ? "text-gray-600" : "text-blue-800"}`}>
                      {notification.message}
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
                {notifications.length > 3 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">Dan {notifications.length - 3} notifikasi lainnya...</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  )
}
