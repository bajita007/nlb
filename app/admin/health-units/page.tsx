"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Building2, Users } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/components/ui/use-toast"
import {
  getAllHealthUnits,
  createHealthUnit,
  updateHealthUnit,
  deleteHealthUnit,
} from "@/app/actions/health-unit-actions"
import type { HealthUnit } from "@/types/database"

export default function HealthUnitsPage() {
  const { toast } = useToast()
  const [healthUnits, setHealthUnits] = useState<HealthUnit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<HealthUnit | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "Puskesmas",
    is_active: true,
  })

  useEffect(() => {
    loadHealthUnits()
  }, [])

  const loadHealthUnits = async () => {
    try {
      setIsLoading(true)
      const result = await getAllHealthUnits()

      if (result.success) {
        setHealthUnits(result.data || [])
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data unit kesehatan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let result
      if (editingUnit) {
        result = await updateHealthUnit(editingUnit.id, formData)
      } else {
        result = await createHealthUnit(formData)
      }

      if (result.success) {
        toast({
          title: "Berhasil",
          description: editingUnit ? "Unit kesehatan berhasil diperbarui" : "Unit kesehatan berhasil ditambahkan",
        })
        loadHealthUnits()
        resetForm()
      } else {
        toast({
          title: "Gagal",
          description: result.error || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (unit: HealthUnit) => {
    setEditingUnit(unit)
    setFormData({
      name: unit.name,
      type: unit.type,
      is_active: unit.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (unit: HealthUnit) => {
    if ((unit.respondent_count || 0) > 0) {
      toast({
        title: "Tidak dapat menghapus",
        description: "Unit kesehatan ini memiliki responden dan tidak dapat dihapus",
        variant: "destructive",
      })
      return
    }

    if (confirm("Yakin ingin menghapus unit kesehatan ini?")) {
      try {
        const result = await deleteHealthUnit(unit.id)

        if (result.success) {
          toast({
            title: "Berhasil",
            description: "Unit kesehatan berhasil dihapus",
          })
          loadHealthUnits()
        } else {
          toast({
            title: "Gagal",
            description: result.error || "Terjadi kesalahan",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat menghapus data",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "Puskesmas",
      is_active: true,
    })
    setEditingUnit(null)
    setIsDialogOpen(false)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Puskesmas":
        return "bg-blue-100 text-blue-800"
      case "RS":
        return "bg-green-100 text-green-800"
      case "Klinik":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data unit kesehatan...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Tempat Konsultasi</h1>
            <p className="text-gray-600">Kelola daftar puskesmas, rumah sakit, dan klinik</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Tempat Konsultasi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUnit ? "Edit Tempat Konsultasi" : "Tambah Tempat Konsultasi Baru"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Tempat Konsultasi</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Puskesmas Bangkala"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Jenis</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Puskesmas">Puskesmas</SelectItem>
                      <SelectItem value="RS">Rumah Sakit</SelectItem>
                      <SelectItem value="Klinik">Klinik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <Label htmlFor="is_active">Aktif</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingUnit ? "Perbarui" : "Simpan"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Tempat</p>
                  <p className="text-2xl font-bold">{healthUnits.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Puskesmas</p>
                  <p className="text-2xl font-bold">{healthUnits.filter((u) => u.type === "Puskesmas").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rumah Sakit</p>
                  <p className="text-2xl font-bold">{healthUnits.filter((u) => u.type === "RS").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Responden</p>
                  <p className="text-2xl font-bold">
                    {healthUnits.reduce((sum, unit) => sum + (unit.respondent_count || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Units Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Tempat Konsultasi</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {healthUnits.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Belum ada tempat konsultasi</p>
                <Button onClick={openAddDialog} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Tempat Konsultasi Pertama
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Jumlah Responden</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthUnits.map((unit) => (
                      <TableRow key={unit.id}>
                        <TableCell>
                          <div className="font-medium">{unit.name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(unit.type)}>{unit.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{unit.respondent_count || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={unit.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {unit.is_active ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(unit)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleDelete(unit)}
                              disabled={(unit.respondent_count || 0) > 0}
                              title={
                                (unit.respondent_count || 0) > 0
                                  ? "Tidak dapat menghapus tempat yang memiliki responden"
                                  : "Hapus tempat konsultasi"
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
