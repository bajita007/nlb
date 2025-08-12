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
import { getRespondentById, deleteRespondent } from "@/app/actions/posttest-actions"
import { useToast } from "@/components/ui/use-toast"

interface RespondentData {
       id: string,
     user_id: string,
      user_name: string,
      user_phone: string,
      answers:  number[],
      total_depression_score: number,
      depression_category: string,
      total_anxiety_score: number,
      anxiety_category: string,
      submitted_at:string,
      created_at: string,

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
          id: ""
        })
        router.push("/admin/data-posttest")
      }
    } catch (error) {
      console.error("Error loading respondent:", error)
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
          id: ""
        })
        router.push("/admin/data-posttest")
      } else {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat menghapus data",
          variant: "destructive",
          id: ""
        })
      }
    } catch (error) {
      console.error("Error deleting respondent:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus data",
        variant: "destructive",
        id: ""
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
          <Link href="/admin/data-posttest">
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
            <Link href="/admin/data-posttest">
              <Button variant="outline" size="icon" className="hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detail Responden</h1>
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

        <div className="grid grid-cols-1 gap-6">
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
                  <p className="font-semibold text-lg text-gray-900">{respondent.user_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tanggal Lahir</label>
                    <p className="flex items-center gap-1 font-medium">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(respondent.user_phone).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                 
                </div>
                
                
              </div>
            </CardContent>
          </Card>

       
        </div>


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
                const selectedScore = respondent.answers[index] || 0
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
