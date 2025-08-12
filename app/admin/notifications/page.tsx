// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/components/ui/use-toast"
// import { AdminLayout } from "@/components/admin-layout"
// import { Send, Bell, User, Calendar, Smartphone, Monitor, CheckCircle, XCircle } from "lucide-react"
// import { getAllAppUsers, type AppUser } from "@/app/actions/user-actions"
// import {
//   sendNotificationToAppUser,
//   getAllAppUserNotifications,
//   getActiveSubscriptions,
// } from "@/app/actions/notification-actions"
// import { sendPushNotification } from "@/lib/push-notifications"

// interface Notification {
//   id: string
//   user_id: string
//   title: string
//   message: string
//   notification_type: string
//   created_at: string
//   is_read: boolean
//   devices_sent_to: number
//   delivery_status: Record<string, string>
//   user?: {
//     full_name: string
//     email: string
//   }
// }

// interface ActiveSubscription {
//   id: string
//   user_id: string
//   device_name: string
//   device_type: string
//   last_used_at: string
//   user?: {
//     full_name: string
//     email: string
//   }
// }

// export default function NotificationsPage() {
//   const [users, setUsers] = useState<AppUser[]>([])
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [selectedUserId, setSelectedUserId] = useState<string>("")
//   const [title, setTitle] = useState("")
//   const [message, setMessage] = useState("")
//   const [notificationType, setNotificationType] = useState("info")
//   const [enablePushNotification, setEnablePushNotification] = useState(true)
//   const { toast } = useToast()

//   useEffect(() => {
//     loadData()
//   }, [])

//   const loadData = async () => {
//     try {
//       setLoading(true)
//       const [usersResult, notificationsResult, subscriptionsResult] = await Promise.all([
//         getAllAppUsers(),
//         getAllAppUserNotifications(),
//         getActiveSubscriptions(),
//       ])

//       if (usersResult.success) {
//         setUsers(usersResult.data || [])
//       }

//       if (notificationsResult.success) {
//         setNotifications(notificationsResult.data || [])
//       }

//       if (subscriptionsResult.success) {
//         setActiveSubscriptions(subscriptionsResult.data || [])
//       }
//     } catch (error) {
//       console.error("Error loading data:", error)
//       toast({
//         title: "Error",
//         description: "Terjadi kesalahan saat memuat data",
//         variant: "destructive",
//         id: ""
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSendNotification = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!selectedUserId || !title.trim() || !message.trim()) {
//       toast({
//         title: "Error",
//         description: "Semua field harus diisi",
//         variant: "destructive",
//         id: ""
//       })
//       return
//     }

//     try {
//       setIsSubmitting(true)

//       const [dbResult, pushResult] = await Promise.all([
//         sendNotificationToAppUser({
//           userId: selectedUserId,
//           title: title.trim(),
//           message: message.trim(),
//         }),
//         enablePushNotification
//           ? sendPushNotification(selectedUserId, title.trim(), message.trim(), notificationType)
//           : Promise.resolve({ success: true }),
//       ])

//       if (dbResult.success) {
//         const selectedUser = users.find((u) => u.id === selectedUserId)
//         const deviceCount = pushResult.success ? pushResult.devicesCount || 0 : 0

//         toast({
//           title: "Berhasil",
//           description: `Notifikasi berhasil dikirim ke ${selectedUser?.full_name}${enablePushNotification ? ` (${deviceCount} perangkat)` : ""}`,
//           id: ""
//         })

//         // Reset form
//         setSelectedUserId("")
//         setTitle("")
//         setMessage("")
//         setNotificationType("info")

//         // Reload data to show new notification
//         loadData()
//       } else {
//         toast({
//           title: "Error",
//           description: dbResult.error || "Gagal mengirim notifikasi",
//           variant: "destructive",
//           id: ""
//         })
//       }
//     } catch (error) {
//       console.error("Error sending notification:", error)
//       toast({
//         title: "Error",
//         description: "Terjadi kesalahan saat mengirim notifikasi",
//         variant: "destructive",
//         id: ""
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const getUserName = (userId: string) => {
//     const user = users.find((u) => u.id === userId)
//     return user ? user.full_name : "Pengguna tidak ditemukan"
//   }

//   const getDeliveryStatusIcon = (status: string) => {
//     switch (status) {
//       case "delivered":
//       case "sent":
//         return <CheckCircle className="h-3 w-3 text-green-600" />
//       case "failed":
//         return <XCircle className="h-3 w-3 text-red-600" />
//       default:
//         return <Monitor className="h-3 w-3 text-gray-400" />
//     }
//   }

//   const activeUsersWithDevices = users.filter(
//     (user) => user.is_active && activeSubscriptions.some((sub) => sub.user_id === user.id),
//   )

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Notifikasi Multi-Device</h1>
//           <p className="text-muted-foreground">Kirim notifikasi push ke semua perangkat pengguna</p>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-2">
//           {/* Send Notification Form */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Send className="h-5 w-5" />
//                 Kirim Notifikasi Push
//               </CardTitle>
//               <CardDescription>Kirim notifikasi ke semua perangkat pengguna yang terdaftar</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSendNotification} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="user">Pilih Pengguna</Label>
//                   <Select value={selectedUserId} onValueChange={setSelectedUserId}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Pilih pengguna..." />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {users
//                         .filter((user) => user.is_active)
//                         .map((user) => {
//                           const userDevices = activeSubscriptions.filter((sub) => sub.user_id === user.id)
//                           return (
//                             <SelectItem key={user.id} value={user.id}>
//                               <div className="flex items-center gap-2">
//                                 <User className="h-4 w-4" />
//                                 <span>{user.full_name}</span>
//                                 <span className="text-sm text-gray-500">({user.email})</span>
//                                 {userDevices.length > 0 && (
//                                   <Badge variant="outline" className="text-xs">
//                                     <Smartphone className="h-3 w-3 mr-1" />
//                                     {userDevices.length} device
//                                   </Badge>
//                                 )}
//                               </div>
//                             </SelectItem>
//                           )
//                         })}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="title">Judul Notifikasi</Label>
//                   <Input
//                     id="title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Masukkan judul notifikasi..."
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="message">Pesan</Label>
//                   <Textarea
//                     id="message"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Masukkan pesan notifikasi..."
//                     rows={4}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="type">Tipe Notifikasi</Label>
//                   <Select value={notificationType} onValueChange={setNotificationType}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="info">Info</SelectItem>
//                       <SelectItem value="reminder">Reminder</SelectItem>
//                       <SelectItem value="alert">Alert</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <Smartphone className="h-4 w-4 text-blue-600" />
//                     <span className="text-sm font-medium">Kirim Push Notification</span>
//                   </div>
//                   <Switch checked={enablePushNotification} onCheckedChange={setEnablePushNotification} />
//                 </div>

//                 <Button type="submit" disabled={isSubmitting} className="w-full">
//                   {isSubmitting ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Mengirim...
//                     </>
//                   ) : (
//                     <>
//                       <Send className="h-4 w-4 mr-2" />
//                       Kirim Notifikasi
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Statistics */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Bell className="h-5 w-5" />
//                 Statistik Push Notification
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
//                   <span className="font-medium">Total Pengguna Aktif</span>
//                   <Badge variant="default">{users.filter((u) => u.is_active).length}</Badge>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
//                   <span className="font-medium">Pengguna dengan Push Aktif</span>
//                   <Badge variant="secondary">{activeUsersWithDevices.length}</Badge>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
//                   <span className="font-medium">Total Perangkat Terdaftar</span>
//                   <Badge variant="outline">{activeSubscriptions.length}</Badge>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
//                   <span className="font-medium">Notifikasi Terkirim</span>
//                   <Badge variant="secondary">{notifications.length}</Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Active Subscriptions */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Perangkat Aktif</CardTitle>
//             <CardDescription>Daftar perangkat yang dapat menerima push notification</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {activeSubscriptions.length === 0 ? (
//               <div className="text-center py-8">
//                 <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-lg font-medium text-gray-900">Belum ada perangkat terdaftar</p>
//                 <p className="text-gray-500">Pengguna perlu mengaktifkan notifikasi push di aplikasi</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {activeSubscriptions.slice(0, 10).map((subscription) => (
//                   <div
//                     key={subscription.id}
//                     className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Monitor className="h-4 w-4 text-gray-600" />
//                       <div>
//                         <p className="font-medium text-sm">{subscription.user?.full_name || "Unknown User"}</p>
//                         <p className="text-xs text-gray-500">
//                           {subscription.device_name} • {subscription.device_type}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <Badge variant="outline" className="text-xs">
//                         Aktif
//                       </Badge>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {new Date(subscription.last_used_at).toLocaleDateString("id-ID")}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Notification History */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Riwayat Notifikasi Push</CardTitle>
//             <CardDescription>Daftar notifikasi yang telah dikirim dengan status pengiriman</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="flex justify-center items-center h-32">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="text-center py-8">
//                 <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <p className="text-lg font-medium text-gray-900">Belum ada notifikasi</p>
//                 <p className="text-gray-500">Notifikasi yang dikirim akan muncul di sini</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {notifications.slice(0, 10).map((notification) => (
//                   <div
//                     key={notification.id}
//                     className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
//                   >
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <h4 className="font-medium">{notification.title}</h4>
//                         <Badge variant="outline" className="text-xs">
//                           {notification.notification_type}
//                         </Badge>
//                         {notification.devices_sent_to > 0 && (
//                           <Badge variant="secondary" className="text-xs">
//                             <Smartphone className="h-3 w-3 mr-1" />
//                             {notification.devices_sent_to} devices
//                           </Badge>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
//                       <div className="flex items-center gap-4 text-xs text-gray-500">
//                         <span className="flex items-center gap-1">
//                           <User className="h-3 w-3" />
//                           {notification.user?.full_name || getUserName(notification.user_id)}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Calendar className="h-3 w-3" />
//                           {new Date(notification.created_at).toLocaleDateString("id-ID", {
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </span>
//                       </div>
//                       {notification.delivery_status && Object.keys(notification.delivery_status).length > 0 && (
//                         <div className="flex items-center gap-2 mt-2">
//                           <span className="text-xs text-gray-500">Status pengiriman:</span>
//                           {Object.entries(notification.delivery_status).map(([deviceId, status]) => (
//                             <div key={deviceId} className="flex items-center gap-1">
//                               {getDeliveryStatusIcon(status)}
//                               <span className="text-xs text-gray-500">{status}</span>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </AdminLayout>
//   )
// }
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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { AdminLayout } from "@/components/admin-layout"
import { Send, Bell, User, Calendar, Smartphone, Monitor, CheckCircle, XCircle } from "lucide-react"
import { getAllAppUsers, type AppUser } from "@/app/actions/user-actions"
import {
  sendNotificationToAppUser,
  getAllAppUserNotifications,
  getActiveSubscriptions,
} from "@/app/actions/notification-actions"
import { sendPushNotification } from "@/lib/push-notifications"

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  notification_type: string
  created_at: string
  is_read: boolean
  devices_sent_to: number
  delivery_status: Record<string, string>
  user?: {
    full_name: string
    email: string
  }
}

interface ActiveSubscription {
  id: string
  user_id: string
  device_name: string
  device_type: string
  last_used_at: string
  user?: {
    full_name: string
    email: string
  }
}

export default function NotificationsPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeSubscriptions, setActiveSubscriptions] = useState<ActiveSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [notificationType] = useState("reminder")
  const [enablePushNotification, setEnablePushNotification] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersResult, notificationsResult, subscriptionsResult] = await Promise.all([
        getAllAppUsers(),
        getAllAppUserNotifications(),
        getActiveSubscriptions(),
      ])

      if (usersResult.success) {
        setUsers(usersResult.data || [])
      }

      if (notificationsResult.success) {
        setNotifications(notificationsResult.data || [])
      }

      if (subscriptionsResult.success) {
        setActiveSubscriptions(subscriptionsResult.data || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
        id: "",
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
        id: "",
      })
      return
    }

    try {
      setIsSubmitting(true)

      if (selectedUserId === "all") {
        const activeUsers = users.filter((u) => u.is_active)
        const results = await Promise.all(
          activeUsers.map(async (user) => {
            const [dbResult, pushResult] = await Promise.all([
              sendNotificationToAppUser({
                userId: user.id,
                title: title.trim(),
                message: message.trim(),
              }),
              enablePushNotification
                ? sendPushNotification(user.id, title.trim(), message.trim(), notificationType)
                : Promise.resolve({ success: true }),
            ])
            return { user, dbResult, pushResult }
          }),
        )

        const successCount = results.filter((r) => r.dbResult.success).length
        const totalDevices = results.reduce((sum, r) => sum + (r.pushResult.devicesCount || 0), 0)

        toast({
          title: "Berhasil",
          description: `Notifikasi berhasil dikirim ke ${successCount} pengguna${enablePushNotification ? ` (${totalDevices} perangkat)` : ""}`,
          id: "",
        })
      } else {
        const [dbResult, pushResult] = await Promise.all([
          sendNotificationToAppUser({
            userId: selectedUserId,
            title: title.trim(),
            message: message.trim(),
          }),
          enablePushNotification
            ? sendPushNotification(selectedUserId, title.trim(), message.trim(), notificationType)
            : Promise.resolve({ success: true }),
        ])

        if (dbResult.success) {
          const selectedUser = users.find((u) => u.id === selectedUserId)
          const deviceCount = pushResult.success ? pushResult.devicesCount || 0 : 0

          toast({
            title: "Berhasil",
            description: `Notifikasi berhasil dikirim ke ${selectedUser?.full_name}${enablePushNotification ? ` (${deviceCount} perangkat)` : ""}`,
            id: "",
          })
        } else {
          toast({
            title: "Error",
            description: dbResult.error || "Gagal mengirim notifikasi",
            variant: "destructive",
            id: "",
          })
        }
      }

      setSelectedUserId("")
      setTitle("")
      setMessage("")

      loadData()
    } catch (error) {
      console.error("Error sending notification:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim notifikasi",
        variant: "destructive",
        id: "",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.full_name : "Pengguna tidak ditemukan"
  }

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "sent":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "failed":
        return <XCircle className="h-3 w-3 text-red-600" />
      default:
        return <Monitor className="h-3 w-3 text-gray-400" />
    }
  }

  const activeUsersWithDevices = users.filter(
    (user) => user.is_active && activeSubscriptions.some((sub) => sub.user_id === user.id),
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifikasi Multi-Device</h1>
          <p className="text-muted-foreground">Kirim notifikasi push ke semua perangkat pengguna</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-1">
          {/* Send Notification Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Kirim Notifikasi Push
              </CardTitle>
              <CardDescription>Kirim notifikasi ke semua perangkat pengguna yang terdaftar</CardDescription>
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
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span className="font-medium">Semua Pengguna</span>
                          <Badge variant="secondary" className="text-xs">
                            {users.filter((user) => user.is_active).length} pengguna
                          </Badge>
                        </div>
                      </SelectItem>
                      {users
                        .filter((user) => user.is_active)
                        .map((user) => {
                          const userDevices = activeSubscriptions.filter((sub) => sub.user_id === user.id)
                          return (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{user.full_name}</span>
                                <span className="text-sm text-gray-500">({user.email})</span>
                                {userDevices.length > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    <Smartphone className="h-3 w-3 mr-1" />
                                    {userDevices.length} device
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          )
                        })}
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

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Kirim Push Notification</span>
                  </div>
                  <Switch checked={enablePushNotification} onCheckedChange={setEnablePushNotification} />
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
        </div>

        {/* Active Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Perangkat Aktif</CardTitle>
            <CardDescription>Daftar perangkat yang dapat menerima push notification</CardDescription>
          </CardHeader>
          <CardContent>
            {activeSubscriptions.length === 0 ? (
              <div className="text-center py-8">
                <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">Belum ada perangkat terdaftar</p>
                <p className="text-gray-500">Pengguna perlu mengaktifkan notifikasi push di aplikasi</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeSubscriptions.slice(0, 10).map((subscription) => (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Monitor className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="font-medium text-sm">{subscription.user?.full_name || "Unknown User"}</p>
                        <p className="text-xs text-gray-500">
                          {subscription.device_name} • {subscription.device_type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        Aktif
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(subscription.last_used_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification History */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Notifikasi Push</CardTitle>
            <CardDescription>Daftar notifikasi yang telah dikirim dengan status pengiriman</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">Belum ada notifikasi</p>
                <p className="text-gray-500">Notifikasi yang dikirim akan muncul di sini</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.slice(0, 10).map((notification) => (
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
                        {notification.devices_sent_to > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Smartphone className="h-3 w-3 mr-1" />
                            {notification.devices_sent_to} devices
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {notification.user?.full_name || getUserName(notification.user_id)}
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
                      {notification.delivery_status && Object.keys(notification.delivery_status).length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Status pengiriman:</span>
                          {Object.entries(notification.delivery_status).map(([deviceId, status]) => (
                            <div key={deviceId} className="flex items-center gap-1">
                              {getDeliveryStatusIcon(status)}
                              <span className="text-xs text-gray-500">{status}</span>
                            </div>
                          ))}
                        </div>
                      )}
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
