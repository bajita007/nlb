"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Download, Filter } from "lucide-react" // Removed Phone, MapPin
import Link from "next/link"
import { AdminLayout } from "@/components/admin-layout"
import { getAllRespondents } from "@/app/actions/respondent-actions"
import { getExportData } from "@/app/actions/admin-crud-actions"
import { useToast } from "@/components/ui/use-toast"
import * as XLSX from "xlsx"

interface RespondentData {
  id: string
  user_id: string
  respondent_number: string
  nama: string
  tanggal_lahir: string
  nomor_telepon: string
  nama_puskesmas: string
  alamat: string
  total_depression_score: number // Updated column name
  depression_category: string // Updated column name
  total_anxiety_score: number // New column
  anxiety_category: string // New column
  submitted_at: string
  device_id: string
  // Add other fields that might be in your database for a complete export
  berat_badan?: number
  tinggi_badan?: number
  lila?: number
  pendidikan?: string
  pekerjaan?: string
  status_pernikahan?: string
  pekerjaan_suami?: string
  pendidikan_suami?: string
  riwayat_antidepresan?: boolean
  riwayat_keluarga_antidepresan?: boolean
  dukungan_suami?: string
  dukungan_keluarga?: string
  nama_anggota_keluarga?: string
  riwayat_masalah_kesehatan?: string
  masalah_kehamilan?: string
  kuesioner?: number[]
}

const healthUnits = [
  "Semua Unit",
  "Puskesmas Bangkala",
  "Puskesmas Batang",
  "Puskesmas Binamu",
  "Puskesmas Bontoramba",
  "Puskesmas Kelara",
  "Puskesmas Rumbia",
  "Puskesmas Tamalatea",
  "Puskesmas Turatea",
  "RSUD Jeneponto",
  "RS Bersalin Siti Khadijah",
  "Klinik Pratama Lainnya",
]

export default function RespondentsPage() {
  const { toast } = useToast()
  const [data, setData] = useState<RespondentData[]>([])
  const [filteredData, setFilteredData] = useState<RespondentData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUnit, setSelectedUnit] = useState("Semua Unit")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterData()
  }, [data, searchTerm, selectedUnit])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const result = await getAllRespondents()

      if (result.success) {
        setData(result.data || [])
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data responden",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading respondents:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterData = () => {
    let filtered = data

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nomor_telepon.includes(searchTerm) ||
          item.respondent_number.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by health unit
    if (selectedUnit !== "Semua Unit") {
      filtered = filtered.filter((item) => item.nama_puskesmas === selectedUnit)
    }

    setFilteredData(filtered)
  }

  const getDepressionCategoryColor = (category: string) => {
    switch (category) {
      case "Sangat Ringan":
        return "bg-green-100 text-green-800"
      case "Ringan-Sedang":
        return "bg-yellow-100 text-yellow-800"
      case "Sedang-Berat":
        return "bg-orange-100 text-orange-800"
      case "Berat":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAnxietyCategoryColor = (category: string) => {
    switch (category) {
      case "Tidak ada gejala atau Ringan":
        return "bg-green-100 text-green-800"
      case "Ringan hingga Sedang":
        return "bg-yellow-100 text-yellow-800"
      case "Berat":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportToExcel = async () => {
    try {
      const result = await getExportData() // Use the getExportData action from admin-crud-actions

      if (result.success && result.data && result.data.length > 0) {
        // Prepare data for export, ensuring all relevant fields are included
        const dataToExport = result.data.map((row) => ({
          "ID Responden": row.respondent_number,
          "Nama Lengkap": row.nama,
          "Tanggal Lahir": new Date(row.tanggal_lahir).toLocaleDateString("id-ID"),
          Alamat: row.alamat,
          "Nomor Telepon": row.nomor_telepon,
          "Nama Puskesmas": row.nama_puskesmas,
          "Berat Badan": row.berat_badan,
          "Tinggi Badan": row.tinggi_badan,
          LILA: row.lila,
          Pendidikan: row.pendidikan,
          Pekerjaan: row.pekerjaan,
          "Status Pernikahan": row.status_pernikahan,
          "Pekerjaan Suami": row.pekerjaan_suami,
          "Pendidikan Suami": row.pendidikan_suami,
          "Riwayat Antidepresan": row.riwayat_antidepresan ? "Ya" : "Tidak",
          "Riwayat Keluarga Antidepresan": row.riwayat_keluarga_antidepresan ? "Ya" : "Tidak",
          "Dukungan Suami": row.dukungan_suami,
          "Dukungan Keluarga": row.dukungan_keluarga,
          "Nama Anggota Keluarga": row.nama_anggota_keluarga,
          "Riwayat Masalah Kesehatan": row.riwayat_masalah_kesehatan,
          "Masalah Kehamilan": row.masalah_kehamilan,
          "Skor Depresi (EPDS)": row.total_depression_score, // Updated column name
          "Kategori Depresi": row.depression_category, // Updated column name
          "Skor Kecemasan (Q3-5)": row.total_anxiety_score, // New column
          "Kategori Kecemasan": row.anxiety_category, // New column
          "Tanggal Submit":
            new Date(row.submitted_at).toLocaleDateString("id-ID") +
            " " +
            new Date(row.submitted_at).toLocaleTimeString("id-ID"),
          "ID Pengguna (Internal)": row.user_id,
          "ID Perangkat": row.device_id,
          // Add individual questionnaire scores if needed, e.g., "Kuesioner 1": row.kuesioner?.[0]
          ...Object.fromEntries((row.kuesioner || []).map((score, index) => [`Kuesioner ${index + 1}`, score])),
        }))

        const ws = XLSX.utils.json_to_sheet(dataToExport)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Data Responden Lengkap")

        // Generate Excel file as a binary string
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" })

        // Create a download link and trigger click
        const url = window.URL.createObjectURL(dataBlob)
        const a = document.createElement("a")
        a.href = url
        a.download = "data_responden_lengkap.xlsx"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Export Berhasil",
          description: "Data responden lengkap berhasil diekspor ke Excel.",
        })
      } else {
        toast({
          title: "Tidak ada data",
          description: "Tidak ada data responden untuk diekspor.",
        })
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat mengekspor data ke Excel.",
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
            <p className="mt-4 text-gray-600">Memuat data responden...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Data Responden</h1>
            <p className="text-gray-600">Kelola data responden penelitian</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportToExcel} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Excel
            </Button>
            {/* Removed "Tambah Responden" button */}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama, nomor telepon, atau ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih unit pelayanan" />
                </SelectTrigger>
                <SelectContent>
                  {healthUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {filteredData.length} dari {data.length} responden
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Responden</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada data responden ditemukan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Unit Pelayanan</TableHead>
                      <TableHead>Skor Depresi</TableHead>
                      <TableHead>Kategori Depresi</TableHead>
                      <TableHead>Skor Kecemasan</TableHead>
                      <TableHead>Kategori Kecemasan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((respondent) => (
                      <TableRow key={respondent.id}>
                        <TableCell className="font-mono text-sm">{respondent.respondent_number}</TableCell>
                        <TableCell>{respondent.nama}</TableCell>
                        <TableCell>
                          <div className="text-sm">{respondent.nama_puskesmas}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-lg">{respondent.total_depression_score}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDepressionCategoryColor(respondent.depression_category)}>
                            {respondent.depression_category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-lg">{respondent.total_anxiety_score}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getAnxietyCategoryColor(respondent.anxiety_category)}>
                            {respondent.anxiety_category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{new Date(respondent.submitted_at).toLocaleDateString("id-ID")}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Link href={`/admin/respondent/${respondent.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" /> Lihat Detail
                              </Button>
                            </Link>
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
