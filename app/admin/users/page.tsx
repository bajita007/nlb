"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { AdminLayout } from "@/components/admin-layout"
import { UserPlus, Edit, Trash2, Mail, Phone, Calendar, User } from "lucide-react"
import { getAllAppUsers, createAppUser, updateAppUser, deleteAppUser, type AppUser } from "@/app/actions/user-actions"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AppUser | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const result = await getAllAppUsers()
      if (result.success) {
        setUsers(result.data || [])
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal memuat data pengguna",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading users:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      const result = await createAppUser(formData)

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Pengguna berhasil ditambahkan",
        })
        setIsAddDialogOpen(false)
        loadUsers()
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal menambahkan pengguna",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menambahkan pengguna",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = async (formData: FormData) => {
    if (!editingUser) return

    try {
      setIsSubmitting(true)
      const result = await updateAppUser(editingUser.id, formData)

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Pengguna berhasil diperbarui",
        })
        setIsEditDialogOpen(false)
        setEditingUser(null)
        loadUsers()
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal memperbarui pengguna",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui pengguna",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return

    try {
      const result = await deleteAppUser(userId)

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Pengguna berhasil dihapus",
        })
        loadUsers()
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal menghapus pengguna",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus pengguna",
        variant: "destructive",
      })
    }
  }

  const UserForm = ({ user, onSubmit }: { user?: AppUser; onSubmit: (formData: FormData) => void }) => (
    <form action={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input id="fullName" name="fullName" defaultValue={user?.full_name || ""} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={user?.email || ""} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Nomor Telepon</Label>
          <Input id="phoneNumber" name="phoneNumber" defaultValue={user?.phone_number || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password {user ? "(kosongkan jika tidak diubah)" : ""}</Label>
          <Input id="password" name="password" type="password" required={!user} />
        </div>
      </div>

      {user && (
        <div className="flex items-center space-x-2">
          <Switch id="isActive" name="isActive" defaultChecked={user.is_active} />
          <Label htmlFor="isActive">Akun Aktif</Label>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
            setEditingUser(null)
          }}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : user ? "Perbarui" : "Tambah"}
        </Button>
      </div>
    </form>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
            <p className="text-muted-foreground">Kelola pengguna aplikasi mobile</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Tambah Pengguna
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                <DialogDescription>Tambahkan pengguna baru yang dapat mengakses aplikasi mobile</DialogDescription>
              </DialogHeader>
              <UserForm onSubmit={handleAddUser} />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {users.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <User className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">Belum ada pengguna</p>
                  <p className="text-gray-500">Tambahkan pengguna pertama untuk memulai</p>
                </CardContent>
              </Card>
            ) : (
              users.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {user.full_name}
                          <Badge variant={user.is_active ? "default" : "secondary"}>
                            {user.is_active ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                          {user.phone_number && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone_number}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Dibuat: {new Date(user.created_at).toLocaleDateString("id-ID")}
                      </span>
                      {user.last_login && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Login terakhir: {new Date(user.last_login).toLocaleDateString("id-ID")}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Pengguna</DialogTitle>
              <DialogDescription>Perbarui informasi pengguna</DialogDescription>
            </DialogHeader>
            {editingUser && <UserForm user={editingUser} onSubmit={handleEditUser} />}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
