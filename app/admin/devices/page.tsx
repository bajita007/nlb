"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Smartphone, Users, List, X, Eye } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/components/ui/use-toast"
import { getDevicesWithRespondents } from "@/app/actions/admin-crud-actions"
import Link from "next/link"

interface DeviceUser {
  device_id: string
  user_name: string
  phone_number: string
  respondent_count: number
  respondents: { id: string; nama: string; respondent_number: string }[] // 'id' is now the UUID
}

export default function DevicesPage() {
  const { toast } = useToast()
  const [devices, setDevices] = useState<DeviceUser[]>([])
  const [filteredDevices, setFilteredDevices] = useState<DeviceUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedDeviceRespondents, setSelectedDeviceRespondents] = useState<
    { id: string; nama: string; respondent_number: string }[]
  >([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

  useEffect(() => {
    loadDevices()
  }, [])

  useEffect(() => {
    filterDevices()
  }, [devices, searchTerm])

  const loadDevices = async () => {
    try {
      setIsLoading(true)
      const result = await getDevicesWithRespondents()

      if (result.success) {
        setDevices(result.data || [])
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data perangkat",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading devices:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data perangkat",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterDevices = () => {
    let filtered = devices

    if (searchTerm) {
      filtered = filtered.filter(
        (device) =>
          device.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.phone_number.includes(searchTerm) ||
          device.device_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredDevices(filtered)
  }

  const handleViewRespondents = (device: DeviceUser) => {
    setSelectedDeviceRespondents(device.respondents)
    setSelectedDeviceId(device.device_id)
    setIsDetailDialogOpen(true)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data perangkat...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Device & Users</h1>
          <p className="text-gray-600">Daftar perangkat dan pengguna yang terdaftar</p>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama, nomor telepon, atau device ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Perangkat & Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredDevices.length === 0 ? (
              <div className="text-center py-12">
                <Smartphone className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? "Tidak ada perangkat yang ditemukan" : "Belum ada perangkat terdaftar"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device ID</TableHead>
                      <TableHead>Jumlah Responden</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map((device) => (
                      <TableRow key={device.device_id}>
                        <TableCell>
                          <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{device.device_id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{device.respondent_count}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleViewRespondents(device)}>
                            <List className="h-3 w-3 mr-1" /> Lihat Responden
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Respondents Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Responden untuk Device ID: {selectedDeviceId}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {selectedDeviceRespondents.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Tidak ada responden untuk perangkat ini.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Responden</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDeviceRespondents.map((respondent, index) => (
                      <TableRow key={index}>
                        <TableCell>{respondent.respondent_number}</TableCell>
                        <TableCell>{respondent.nama}</TableCell>
                        <TableCell>
                          <Link href={`/admin/respondent/${respondent.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" /> Lihat Detail
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setIsDetailDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" /> Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
