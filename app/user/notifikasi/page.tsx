"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, BellOff, Check, Clock, Smartphone, Settings, MessageSquare, Calendar } from "lucide-react"
import { UserLayout } from "@/components/user-layout"
import { useToast } from "@/components/ui/use-toast"
import { getUserNotifications, markNotificationAsRead } from "@/app/actions/notification-actions"
import { getUserSession } from "@/lib/auth"

interface UserNotification {
  id: string
  user_id: string
  title: string
  message: string
  notification_type: string
  is_read: boolean
  sent_at: string
  created_at: string
}

export default function NotifikasiPage() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [isEnablingPush, setIsEnablingPush] = useState(false)

  useEffect(() => {
    loadNotifications()
    checkPushPermission()
  }, [])

  const loadNotifications = async () => {
    try {
      const userSession = getUserSession()
      if (!userSession) {
        toast({
          title: "Error",
          description: "Silakan login terlebih dahulu",
          variant: "destructive",
        })
        return
      }

      const result = await getUserNotifications(userSession.id)
      if (result.success && result.data) {
        setNotifications(result.data)
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat notifikasi",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat notifikasi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkPushPermission = () => {
    if ("Notification" in window) {
      setPushEnabled(Notification.permission === "granted")
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const result = await markNotificationAsRead(notificationId)
      if (result.success) {
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
        )
        toast({
          title: "Berhasil",
          description: "Notifikasi ditandai sebagai sudah dibaca",
        })
      } else {
        toast({
          title: "Error",
          description: "Gagal menandai notifikasi",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan",
        variant: "destructive",
      })
    }
  }

  const handleEnablePushNotifications = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Tidak Didukung",
        description: "Browser Anda tidak mendukung notifikasi push",
        variant: "destructive",
      })
      return
    }

    setIsEnablingPush(true)

    try {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        setPushEnabled(true)
        toast({
          title: "Berhasil",
          description: "Notifikasi push telah diaktifkan",
        })

        // Test notification
        new Notification("Notifikasi Aktif", {
          body: "Anda akan menerima notifikasi dari aplikasi ini",
          icon: "/icon-192x192.png",
        })
      } else {
        toast({
          title: "Ditolak",
          description: "Izin notifikasi ditolak. Anda dapat mengaktifkannya di pengaturan browser.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengaktifkan notifikasi push",
        variant: "destructive",
      })
    } finally {
      setIsEnablingPush(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Baru saja"
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`
    } else {
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <MessageSquare className="h-5 w-5 text-blue-600" />
      case "reminder":
        return <Clock className="h-5 w-5 text-orange-600" />
      case "alert":
        return <Bell className="h-5 w-5 text-red-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat notifikasi...</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifikasi</h1>
          <p className="text-gray-600 text-sm">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : "Semua notifikasi sudah dibaca"}
          </p>
        </div>

        {/* Push Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Pengaturan Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Notifikasi Push</p>
                  <p className="text-sm text-blue-700">Terima notifikasi langsung di perangkat Anda</p>
                </div>
              </div>
              <Switch checked={pushEnabled} onCheckedChange={() => !pushEnabled && handleEnablePushNotifications()} />
            </div>

            {!pushEnabled && (
              <div className="text-center">
                <Button
                  onClick={handleEnablePushNotifications}
                  disabled={isEnablingPush}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {isEnablingPush ? "Mengaktifkan..." : "Aktifkan Notifikasi HP"}
                </Button>
                <p className="text-xs text-gray-500 mt-2">Klik untuk mengaktifkan notifikasi push di perangkat Anda</p>
              </div>
            )}

            {pushEnabled && (
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-2 text-green-800">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Notifikasi push aktif</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Daftar Notifikasi ({notifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <BellOff className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Belum ada notifikasi</p>
              </div>
            ) : (
              <div className="space-y-0">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b last:border-b-0 ${
                      !notification.is_read ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.notification_type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className={`font-medium ${!notification.is_read ? "text-blue-900" : "text-gray-900"}`}>
                            {notification.title}
                          </h3>
                          {!notification.is_read && <Badge className="bg-blue-100 text-blue-800 text-xs">Baru</Badge>}
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(notification.sent_at)}
                          </div>
                          {!notification.is_read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Tandai Dibaca
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {notifications.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
                  <p className="text-sm text-gray-600">Total Notifikasi</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
                  <p className="text-sm text-gray-600">Sudah Dibaca</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </UserLayout>
  )
}
