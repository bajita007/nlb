"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  User,
  Building2,
  Heart,
  Users,
  AlertTriangle,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin-layout"
import { getRespondentById, deleteRespondent } from "@/app/actions/respondent-actions"
import { useToast } from "@/components/ui/use-toast"

interface RespondentData {
  id: string
  respondent_number: string
  user_id: string
  device_id: string
  nama: string
  tanggal_lahir: string
  alamat: string
  nomor_telepon: string
  nama_puskesmas: string
  berat_badan: string
  tinggi_badan: string
  lila: string
  pendidikan: string
  pekerjaan: string
  status_pernikahan: string
  pekerjaan_suami: string
  pendidikan_suami: string
  riwayat_antidepresan: string
  riwayat_keluarga_antidepresan: string
  dukungan_suami: string
  dukungan_keluarga: string
  nama_anggota_keluarga?: string
  riwayat_masalah_kesehatan?: string
  masalah_kehamilan: string[]
  kuesioner: number[]
  total_depression_score: number // Updated column name
  depression_category: string // Updated column name
  total_anxiety_score: number // New column
  anxiety_category: string // New column
  submitted_at: string
  created_at: string
}

// Define EPDS questions with their options and scores
const epdsQuestions = [
  {
    question: "Saya dapat tertawa dan melihat sisi lucu dari sesuatu",
    options: [
      { text: "Ya, seperti biasa", score: 0 },
      { text: "Tidak terlalu banyak", score: 1 },
      { text: "Tidak terlalu banyak", score: 2 },
      { text: "Tidak sama sekali", score: 3 },
    ],
  },
  {
    question: "Saya dapat menantikan sesuatu dengan penuh kegembiraan",
    options: [
      { text: "Sebanyak yang saya bisa", score: 0 },
      { text: "Tidak terlalu banyak", score: 1 },
      { text: "Jelas tidak sebanyak itu sekarang", score: 2 },
      { text: "Tidak sama sekali", score: 3 },
    ],
  },
  {
    question: "Saya menyalahkan diri sendiri tanpa perlu ketika hal-hal berjalan salah",
    options: [
      { text: "Tidak, tidak pernah", score: 0 },
      { text: "Kadang-kadang", score: 1 },
      { text: "Ya, cukup sering", score: 2 },
      { text: "Ya, sebagian besar waktu", score: 3 },
    ],
  },
  {
    question: "Saya cemas atau khawatir tanpa alasan yang jelas",
    options: [
      { text: "Tidak, tidak sama sekali", score: 0 },
      { text: "Hampir tidak pernah", score: 1 },
      { text: "Ya, kadang-kadang", score: 2 },
      { text: "Ya, seringkali", score: 3 },
    ],
  },
  {
    question: "Saya merasa takut atau panik tanpa alasan yang jelas",
    options: [
      { text: "Tidak, tidak sama sekali", score: 0 },
      { text: "Hampir tidak pernah", score: 1 },
      { text: "Ya, kadang-kadang", score: 2 },
      { text: "Ya, cukup sering", score: 3 },
    ],
  },
  {
    question: "Hal-hal menumpuk di atas saya",
    options: [
      { text: "Tidak, saya mengatasinya seperti biasa", score: 0 },
      { text: "Saya tidak mengatasinya sebaik biasanya", score: 1 },
      { text: "Saya merasa hal-hal menumpuk di atas saya dan saya tidak bisa mengatasinya", score: 2 },
      { text: "Saya sama sekali tidak bisa mengatasinya", score: 3 },
    ],
  },
  {
    question: "Saya sangat tidak bahagia sehingga saya sulit tidur",
    options: [
      { text: "Tidak, tidak sama sekali", score: 0 },
      { text: "Kadang-kadang", score: 1 },
      { text: "Cukup sering", score: 2 },
      { text: "Sebagian besar waktu", score: 3 },
    ],
  },
  {
    question: "Saya merasa sedih atau sengsara",
    options: [
      { text: "Tidak, tidak sama sekali", score: 0 },
      { text: "Tidak terlalu sering", score: 1 },
      { text: "Ya, cukup sering", score: 2 },
      { text: "Ya, sebagian besar waktu", score: 3 },
    ],
  },
  {
    question: "Saya sangat tidak bahagia sehingga saya menangis",
    options: [
      { text: "Tidak, tidak sama sekali", score: 0 },
      { text: "Hanya sesekali", score: 1 },
      { text: "Ya, cukup sering", score: 2 },
      { text: "Ya, sebagian besar waktu", score: 3 },
    ],
  },
  {
    question: "Pikiran untuk menyakiti diri sendiri telah terjadi pada saya",
    options: [
      { text: "Tidak, tidak pernah", score: 0 },
      { text: "Hampir tidak pernah", score: 1 },
      { text: "Kadang-kadang", score: 2 },
      { text: "Ya, cukup sering", score: 3 },
    ],
  },
]

export default function RespondentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [respondent, setRespondent] = useState<RespondentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadRespondentDetail(params.id as string)
    }
  }, [params.id])

  const loadRespondentDetail = async (id: string) => {
    try {
      setIsLoading(true)
      const result = await getRespondentById(id)

      if (result.success && result.data) {
        setRespondent(result.data)
      } else {
        toast({
          title: "Error",
          description: "Data responden tidak ditemukan",
          variant: "destructive",
        })
        router.push("/admin/respondents")
      }
    } catch (error) {
      console.error("Error loading respondent:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!respondent || !confirm("Apakah Anda yakin ingin menghapus data responden ini?")) {
      return
    }

    try {
      setIsDeleting(true)
      const result = await deleteRespondent(respondent.id)

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Data responden berhasil dihapus",
        })
        router.push("/admin/respondents")
      } else {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat menghapus data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting respondent:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus data",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getDepressionCategoryColor = (category: string) => {
    switch (category) {
      case "Sangat Ringan":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Ringan-Sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Sedang-Berat":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Berat":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDepressionScoreColor = (score: number) => {
    if (score <= 9) return "text-emerald-600"
    if (score <= 12) return "text-yellow-600"
    if (score <= 20) return "text-orange-600"
    return "text-red-600"
  }

  const getDepressionRiskLevel = (score: number) => {
    if (score <= 9) return { level: "Rendah", color: "text-emerald-600", bg: "bg-emerald-50" }
    if (score <= 12) return { level: "Sedang", color: "text-yellow-600", bg: "bg-yellow-50" }
    if (score <= 20) return { level: "Tinggi", color: "text-orange-600", bg: "bg-orange-50" }
    return { level: "Sangat Tinggi", color: "text-red-600", bg: "bg-red-50" }
  }

  const getAnxietyCategoryColor = (category: string) => {
    switch (category) {
      case "Tidak ada gejala atau Ringan":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Ringan hingga Sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Berat":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAnxietyScoreColor = (score: number) => {
    if (score <= 3) return "text-emerald-600"
    if (score <= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getAnxietyRiskLevel = (score: number) => {
    if (score <= 3) return { level: "Rendah", color: "text-emerald-600", bg: "bg-emerald-50" }
    if (score <= 6) return { level: "Sedang", color: "text-yellow-600", bg: "bg-yellow-50" }
    return { level: "Tinggi", color: "text-red-600", bg: "bg-red-50" }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat detail responden...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!respondent) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Data responden tidak ditemukan</p>
          <Link href="/admin/respondents">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar
            </Button>
          </Link>
        </div>
      </AdminLayout>
    )
  }

  const depressionRiskInfo = getDepressionRiskLevel(respondent.total_depression_score)
  const anxietyRiskInfo = getAnxietyRiskLevel(respondent.total_anxiety_score)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/respondents">
              <Button variant="outline" size="icon" className="hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Responden</h1>
              <p className="text-gray-600">ID: {respondent.respondent_number}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-red-600 hover:bg-red-50 border-red-200"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>

        {/* Score Summary - Enhanced */}
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div
                  className={`text-5xl font-bold ${getDepressionScoreColor(respondent.total_depression_score)} mb-2`}
                >
                  {respondent.total_depression_score}
                </div>
                <p className="text-sm text-gray-600 font-medium">Total Skor Depresi</p>
                <div
                  className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${depressionRiskInfo.bg} ${depressionRiskInfo.color}`}
                >
                  Risiko {depressionRiskInfo.level}
                </div>
              </div>
              <div className="text-center">
                <Badge
                  className={`text-lg px-4 py-2 border ${getDepressionCategoryColor(respondent.depression_category)}`}
                >
                  {respondent.depression_category}
                </Badge>
                <p className="text-sm text-gray-600 mt-2 font-medium">Kategori Depresi</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700 mb-2">
                  {new Date(respondent.submitted_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <p className="text-sm text-gray-600 font-medium">Tanggal Pengisian</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(respondent.submitted_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 rounded-lg border border-purple-200 bg-purple-50">
                <div className={`text-4xl font-bold ${getAnxietyScoreColor(respondent.total_anxiety_score)} mb-2`}>
                  {respondent.total_anxiety_score}
                </div>
                <p className="text-sm text-gray-600 font-medium">Total Skor Kecemasan (Q3-5)</p>
                <div
                  className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${anxietyRiskInfo.bg} ${anxietyRiskInfo.color}`}
                >
                  Risiko {anxietyRiskInfo.level}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg border border-purple-200 bg-purple-50 flex flex-col justify-center">
                <Badge className={`text-lg px-4 py-2 border ${getAnxietyCategoryColor(respondent.anxiety_category)}`}>
                  {respondent.anxiety_category}
                </Badge>
                <p className="text-sm text-gray-600 mt-2 font-medium">Kategori Kecemasan</p>
              </div>
            </div>

            {(respondent.total_depression_score >= 10 || respondent.total_anxiety_score >= 4) && (
              <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-semibold">Perhatian Khusus Diperlukan</p>
                    <p className="text-red-700 text-sm mt-1">
                      Responden memerlukan evaluasi lebih lanjut dan kemungkinan rujukan ke tenaga kesehatan
                      profesional.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biodata */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <User className="h-5 w-5" />
                Biodata Responden
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Nama Lengkap</label>
                  <p className="font-semibold text-lg text-gray-900">{respondent.nama}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tanggal Lahir</label>
                    <p className="flex items-center gap-1 font-medium">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(respondent.tanggal_lahir).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nomor Telepon</label>
                    <p className="flex items-center gap-1 font-medium">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {respondent.nomor_telepon}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Alamat Lengkap</label>
                  <p className="flex items-start gap-1 font-medium">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    {respondent.alamat}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tempat Konsultasi</label>
                  <p className="flex items-center gap-1 font-medium">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {respondent.nama_puskesmas}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Kesehatan */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Heart className="h-5 w-5" />
                Data Kesehatan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{respondent.berat_badan}</div>
                  <p className="text-sm text-green-600 font-medium">Berat Badan (kg)</p>
                </div>
                <div className="text-center bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{respondent.tinggi_badan}</div>
                  <p className="text-sm text-blue-600 font-medium">Tinggi Badan (cm)</p>
                </div>
                <div className="text-center bg-purple-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">{respondent.lila}</div>
                  <p className="text-sm text-purple-600 font-medium">LILA (cm)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Sosial Ekonomi */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Users className="h-5 w-5" />
              Data Sosial Ekonomi & Keluarga
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">Data Responden</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pendidikan:</span>
                    <span className="font-medium">{respondent.pendidikan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pekerjaan:</span>
                    <span className="font-medium">{respondent.pekerjaan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status Pernikahan:</span>
                    <span className="font-medium">{respondent.status_pernikahan}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">Data Suami/Pasangan</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pendidikan Suami:</span>
                    <span className="font-medium">{respondent.pendidikan_suami}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pekerjaan Suami:</span>
                    <span className="font-medium">{respondent.pekerjaan_suami}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dukungan Sosial & Riwayat */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Heart className="h-5 w-5" />
              Dukungan Sosial & Riwayat Kesehatan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">Dukungan Sosial</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dukungan Suami:</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {respondent.dukungan_suami}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dukungan Keluarga:</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {respondent.dukungan_keluarga}
                    </Badge>
                  </div>
                  {respondent.nama_anggota_keluarga && (
                    <div>
                      <span className="text-gray-600 text-sm">Anggota Keluarga Pendukung:</span>
                      <p className="font-medium mt-1">{respondent.nama_anggota_keluarga}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg border-b pb-2">Riwayat Kesehatan</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Riwayat Antidepresan:</span>
                    <Badge
                      variant="outline"
                      className={
                        respondent.riwayat_antidepresan === "Tidak Pernah"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {respondent.riwayat_antidepresan}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Riwayat Keluarga:</span>
                    <Badge
                      variant="outline"
                      className={
                        respondent.riwayat_keluarga_antidepresan === "Tidak Ada"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {respondent.riwayat_keluarga_antidepresan}
                    </Badge>
                  </div>
                </div>

                {respondent.riwayat_masalah_kesehatan && (
                  <div className="mt-4">
                    <span className="text-gray-600 text-sm">Riwayat Masalah Kesehatan:</span>
                    <p className="text-sm bg-gray-50 p-3 rounded mt-1">{respondent.riwayat_masalah_kesehatan}</p>
                  </div>
                )}
              </div>
            </div>

            {respondent.masalah_kehamilan && respondent.masalah_kehamilan.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">Masalah Kehamilan Saat Ini</h4>
                <div className="flex flex-wrap gap-2">
                  {respondent.masalah_kehamilan.map((masalah: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {masalah}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jawaban Kuesioner EPDS */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-2 text-indigo-800">
              <FileText className="h-5 w-5" />
              Hasil Kuesioner EPDS (Edinburgh Postnatal Depression Scale)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {epdsQuestions.map((q, index) => {
                const selectedScore = respondent.kuesioner[index] || 0
                const selectedOption = q.options.find((opt) => opt.score === selectedScore)
                const answerText = selectedOption ? selectedOption.text : "Tidak ada jawaban"

                return (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          <span className="text-indigo-600 font-semibold">{index + 1}.</span> {q.question}
                        </p>
                        <p className="text-sm text-gray-700 italic">Jawaban: {answerText}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm text-gray-600">Skor:</span>
                        <Badge
                          className={`text-lg px-3 py-1 ${
                            selectedScore >= 2
                              ? "bg-red-100 text-red-800 border-red-200"
                              : selectedScore >= 1
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-green-100 text-green-800 border-green-200"
                          }`}
                        >
                          {selectedScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-lg font-semibold text-gray-700">Total Skor Depresi:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Interpretasi: {respondent.depression_category} • Risiko {depressionRiskInfo.level}
                  </p>
                </div>
                <span className={`text-4xl font-bold ${getDepressionScoreColor(respondent.total_depression_score)}`}>
                  {respondent.total_depression_score}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold text-gray-700">Total Skor Kecemasan (Q3-5):</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Interpretasi: {respondent.anxiety_category} • Risiko {anxietyRiskInfo.level}
                  </p>
                </div>
                <span className={`text-4xl font-bold ${getAnxietyScoreColor(respondent.total_anxiety_score)}`}>
                  {respondent.total_anxiety_score}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
