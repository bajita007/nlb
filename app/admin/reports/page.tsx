"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, FileText, BarChart3, Users, Building2 } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/components/ui/use-toast"
import { getExportData, getDashboardStats } from "@/app/actions/admin-crud-actions" // Import actions
import * as XLSX from "xlsx" // Import XLSX

interface DashboardStats {
  totalRespondents: number
  highRiskRespondents: number
  uniqueHealthUnits: number
  todayRespondents: number
}

export default function ReportsPage() {
  const { toast } = useToast()
  const [selectedReport, setSelectedReport] = useState("")
  const [dateRange, setDateRange] = useState("all")
  const [healthUnit, setHealthUnit] = useState("all")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  const reportTypes = [
    {
      value: "respondents",
      label: "Data Responden Lengkap",
      description: "Semua data responden dengan biodata dan jawaban",
    },
    { value: "summary", label: "Ringkasan Statistik", description: "Ringkasan data dan analisis" },
    { value: "high-risk", label: "Responden Risiko Tinggi", description: "Daftar responden dengan skor ≥ 13" },
    {
      value: "health-units",
      label: "Data per Unit Pelayanan",
      description: "Breakdown data berdasarkan unit kesehatan",
    },
    { value: "devices", label: "Data Perangkat", description: "Informasi perangkat dan pengguna" },
  ]

  const healthUnits = ["Semua Unit", "Puskesmas Bangkala", "Puskesmas Batang", "Puskesmas Binamu", "RSUD Jeneponto"]

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    setIsLoadingStats(true)
    const result = await getDashboardStats()
    if (result.success && result.data) {
      setStats(result.data)
    } else {
      toast({
        title: "Error",
        description: "Gagal memuat statistik dashboard",
        variant: "destructive",
        id: ""
      })
    }
    setIsLoadingStats(false)
  }

  const handleDownloadExcel = async () => {
    if (!selectedReport) {
      toast({
        title: "Pilih Jenis Laporan",
        description: "Silakan pilih jenis laporan yang ingin diunduh",
        variant: "destructive",
        id: ""
      })
      return
    }

    try {
      let dataToExport: any[] = []
      let fileName = "laporan_data.xlsx"
      let sheetName = "Data"

      if (selectedReport === "respondents") {
        const result = await getExportData()
        if (result.success && result.data) {
          dataToExport = result.data
          fileName = "laporan_responden_lengkap.xlsx"
          sheetName = "Responden Lengkap"
        } else {
          toast({
            title: "Tidak ada data",
            description: "Tidak ada data responden untuk diekspor.",
            id: ""
          })
          return
        }
      } else {
        // Placeholder for other report types
        toast({
          title: "Fitur Belum Tersedia",
          description: `Download Excel untuk laporan '${reportTypes.find((r) => r.value === selectedReport)?.label}' belum diimplementasikan.`,
          id: ""
        })
        return
      }

      if (dataToExport.length > 0) {
        const ws = XLSX.utils.json_to_sheet(dataToExport)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, sheetName)
        XLSX.writeFile(wb, fileName)
        toast({
          title: "Download Berhasil",
          description: `Laporan ${reportTypes.find((r) => r.value === selectedReport)?.label} berhasil diunduh.`,
          id: ""
        })
      } else {
        toast({
          title: "Tidak ada data",
          description: "Tidak ada data untuk laporan ini.",
          id: ""
        })
      }
    } catch (error) {
      console.error("Error downloading report:", error)
      toast({
        title: "Download Gagal",
        description: "Terjadi kesalahan saat mengunduh laporan.",
        variant: "destructive",
        id: ""
      })
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan & Export</h1>
          <p className="text-gray-600">Generate dan download laporan data penelitian</p>
        </div>

        {/* Export Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Laporan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Jenis Laporan</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis laporan" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((report) => (
                      <SelectItem key={report.value} value={report.value}>
                        {report.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedReport && (
                  <p className="text-xs text-gray-500 mt-1">
                    {reportTypes.find((r) => r.value === selectedReport)?.description}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Rentang Waktu</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Data</SelectItem>
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="week">7 Hari Terakhir</SelectItem>
                    <SelectItem value="month">30 Hari Terakhir</SelectItem>
                    <SelectItem value="quarter">3 Bulan Terakhir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Unit Pelayanan</label>
                <Select value={healthUnit} onValueChange={setHealthUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {healthUnits.map((unit) => (
                      <SelectItem key={unit} value={unit.toLowerCase().replace(/\s+/g, "-")}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDownloadExcel} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Excel
              </Button>
              {/* Removed Export PDF button */}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Responden</p>
                  {isLoadingStats ? (
                    <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold">{stats?.totalRespondents ?? 0}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risiko Tinggi</p>
                  {isLoadingStats ? (
                    <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold">{stats?.highRiskRespondents ?? 0}</p>
                  )}
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
                  <p className="text-sm text-gray-600">Unit Pelayanan</p>
                  {isLoadingStats ? (
                    <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold">{stats?.uniqueHealthUnits ?? 0}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hari Ini</p>
                  {isLoadingStats ? (
                    <div className="h-6 w-12 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold">{stats?.todayRespondents ?? 0}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Jenis Laporan Tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => (
                <div
                  key={report.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReport === report.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedReport(report.value)}
                >
                  <h4 className="font-medium">{report.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
