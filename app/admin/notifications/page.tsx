"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AdminLayout } from "@/components/admin-layout"
import { Send, Bell, User, Calendar } from "lucide-react"
import { getAllAppUsers, type AppUser } from "@/app/actions/user-actions"
import { sendNotificationToAppUser, getAllNotifications } from "@/app/actions/notification-actions"

interface Notification {
  id: string
  app_user_id?: string
  title?: string
  message: string
  notification_type?: string
  created_at: string
  is_read?: boolean
}

export default function NotificationsPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersResult, notificationsResult] = await Promise.all([getAllAppUsers(), getAllNotifications()])

      if (usersResult.success) {
        setUsers(usersResult.data || [])
      }

      if (notificationsResult.success) {
        setNotifications(notificationsResult.data || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUserId || !title.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const result = await sendNotificationToAppUser({
        appUserId: selectedUserId,
        title: title.trim(),
        message: message.trim(),
      })

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Notifikasi berhasil dikirim",
        })
        setSelectedUserId("")
        setTitle("")
        setMessage("")
        loadData()
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal mengirim notifikasi",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending notification:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim notifikasi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.full_name : "Pengguna tidak ditemukan"
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-muted-foreground">Kirim notifikasi ke pengguna aplikasi</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Send Notification Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Kirim Notifikasi
              </CardTitle>
              <CardDescription>Kirim notifikasi ke pengguna aplikasi mobile</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendNotification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user">Pilih Pengguna</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pengguna..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter((user) => user.is_active)
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{user.full_name}</span>
                              <span className="text-sm text-gray-500">({user.email})</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Judul Notifikasi</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul notifikasi..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Masukkan pesan notifikasi..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Kirim Notifikasi
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Statistik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Total Pengguna Aktif</span>
                  <Badge variant="default">{users.filter((u) => u.is_active).length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Total Notifikasi Terkirim</span>
                  <Badge variant="secondary">{notifications.filter((n) => n.app_user_id).length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification History */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Notifikasi</CardTitle>
            <CardDescription>Daftar notifikasi yang telah dikirim ke pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.filter((n) => n.app_user_id).length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">Belum ada notifikasi</p>
                <p className="text-gray-500">Notifikasi yang dikirim akan muncul di sini</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications
                  .filter((n) => n.app_user_id)
                  .slice(0, 10)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {notification.notification_type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {notification.app_user_id ? getUserName(notification.app_user_id) : "Unknown"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(notification.created_at).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
