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
import { getAllPosttestResults } from "@/app/actions/posttest-actions"
import { getExportData, getExportDataPostTest } from "@/app/actions/admin-crud-actions"
import { useToast } from "@/components/ui/use-toast"
import * as XLSX from "xlsx"

interface RespondentData {
       id: string,
     user_id: string,
      user_name?: string,
      user_phone?: string,
      answers?:  number[],
      total_depression_score: number,
      depression_category: string,
      total_anxiety_score: number,
      anxiety_category: string,
      submitted_at:string,
      created_at: string,

}



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
      const result = await getAllPosttestResults()

      if (result.success) {
        setData(result.data || [])
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data responden",
          variant: "destructive",
          id: ""
        })
      }
    } catch (error) {
      console.error("Error loading respondents:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
        id: ""
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
          item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) 
      )
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
      const result = await getExportDataPostTest() // Use the getExportData action from admin-crud-actions

      if (result.success && result.data && result.data.length > 0) {
        // Prepare data for export, ensuring all relevant fields are included
        const dataToExport = result.data.map((row) => ({
          "ID Responden": row.respondent_number,
          "Nama Lengkap": row.user_name,
          "Nomor Telepon": row.user_phone,
          "Skor Depresi (EPDS)": row.total_depression_score, // Updated column name
          "Kategori Depresi": row.depression_category, // Updated column name
          "Skor Kecemasan (Q3-5)": row.total_anxiety_score, // New column
          "Kategori Kecemasan": row.anxiety_category, // New column
          "Tanggal Submit":
            new Date(row.submitted_at).toLocaleDateString("id-ID") +
            " " +
            new Date(row.submitted_at).toLocaleTimeString("id-ID"),
          "ID Pengguna (Internal)": row.user_id,
          // Add individual questionnaire scores if needed, e.g., "Kuesioner 1": row.kuesioner?.[0]
          ...Object.fromEntries((row.answers || []).map((score, index) => [`Kuesioner ${index + 1}`, score])),
        }))

        const ws = XLSX.utils.json_to_sheet(dataToExport)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Data Responden Post Test")

        // Generate Excel file as a binary string
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" })

        // Create a download link and trigger click
        const url = window.URL.createObjectURL(dataBlob)
        const a = document.createElement("a")
        a.href = url
        a.download = "data_responden_posttest.xlsx"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Export Berhasil",
          description: "Data responden lengkap berhasil diekspor ke Excel.",
          id: ""
        })
      } else {
        toast({
          title: "Tidak ada data",
          description: "Tidak ada data responden untuk diekspor.",
          id: ""
        })
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat mengekspor data ke Excel.",
        variant: "destructive",
        id: ""
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
            <h1 className="text-2xl font-bold text-gray-900">Data Post Test</h1>
            <p className="text-gray-600">Kelola data postest penelitian</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama, nomor telepon, atau ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
         
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
                      <TableHead>Nomor Telpon</TableHead>
                      <TableHead>Skor Depresi</TableHead>
                      <TableHead>Kategori Depresi</TableHead>
                      <TableHead>Skor Kecemasan</TableHead>
                      <TableHead>Kategori Kecemasan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((respondent, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{index+1}</TableCell>
                        <TableCell>{respondent.user_name}</TableCell>
                        <TableCell>
                          <div className="text-sm">{respondent.user_phone}</div>
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
                            <Link href={`/admin/post-test-detail/${respondent.id}`}>
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
