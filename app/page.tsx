"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Baby,
  Shield,
  FileText,
  Search,
  User,
  Building2,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  LogIn,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getRespondentsByPhone } from "./actions/respondent-actions"
import { useToast } from "@/components/ui/use-toast"
import { getUserSession } from "@/lib/auth"

interface RespondentData {
  id: string
  respondent_number: string
  nama: string
  tanggal_lahir: string
  nomor_telepon: string
  nama_puskesmas: string
  total_depression_score: number // Updated column name
  depression_category: string // Updated column name
  total_anxiety_score: number // New column
  anxiety_category: string // New column
  submitted_at: string
  alamat: string
}

export default function HomePage() {
  const { toast } = useToast()
  const [deviceId, setDeviceId] = useState<string>("")
  const [searchPhone, setSearchPhone] = useState<string>("")
  const [searchResults, setSearchResults] = useState<RespondentData[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [userSession, setUserSession] = useState<any>(null)

  useEffect(() => {
    let storedDeviceId = localStorage.getItem("deviceId")
    if (!storedDeviceId) {
      storedDeviceId = "device_" + Math.random().toString(36).substr(2, 9)
      localStorage.setItem("deviceId", storedDeviceId)
    }
    setDeviceId(storedDeviceId)

    const session = getUserSession()
    setUserSession(session)
  }, [])

  const handleSearch = async () => {
    if (!searchPhone.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    try {
      setIsSearching(true)
      const { success, data } = await getRespondentsByPhone(searchPhone.trim())

      if (success) {
        setSearchResults(data || [])
      } else {
        toast({
          title: "Error",
          description: "Gagal mencari data",
          variant: "destructive",
        })
        setSearchResults([])
      }

      setShowResults(true)
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mencari data",
        variant: "destructive",
      })
      setSearchResults([])
      setShowResults(true)
    } finally {
      setIsSearching(false)
    }
  }

  const getDepressionCategoryColor = (category: string) => {
    switch (category) {
      case "Sangat Ringan":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      case "Ringan-Sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Sedang-Berat":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "Berat":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getAnxietyCategoryColor = (category: string) => {
    switch (category) {
      case "Tidak ada gejala atau Ringan":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      case "Ringan hingga Sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Berat":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getDepressionRiskMessage = (category: string, score: number) => {
    if (score > 20) {
      return "Segera konsultasi dengan tenaga kesehatan profesional"
    } else if (score >= 13) {
      return "Disarankan konsultasi dengan bidan atau dokter"
    } else if (score >= 10) {
      return "Perlu perhatian khusus dan dukungan keluarga"
    } else {
      return "Kondisi baik, lanjutkan pemeriksaan rutin"
    }
  }

  const getAnxietyRiskMessage = (category: string, score: number) => {
    if (score >= 7) {
      return "Segera konsultasi dengan tenaga kesehatan profesional untuk kecemasan"
    } else if (score >= 4) {
      return "Disarankan konsultasi dengan bidan atau dokter terkait kecemasan"
    } else {
      return "Kondisi kecemasan baik, lanjutkan pemeriksaan rutin"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=400&width=800"
            alt="Ibu hamil sehat"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-4 py-12">
          <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Kesehatan Mental Ibu</h1>
            <p className="text-cyan-100 text-lg leading-relaxed mb-2">Penelitian Kondisi Kesehatan Mental</p>
            <p className="text-cyan-200 text-sm">Ibu Hamil Primigravida Trimester 3</p>
            <p className="text-cyan-300 text-xs mt-2">Kabupaten Jeneponto, Sulawesi Selatan - 2025</p>
          </div>
        </div>
      </div>

      <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto px-4 -mt-8 relative z-10">
        <Card className="mb-6 shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              {userSession ? "Dashboard Pengguna" : "Login Pengguna"}
            </CardTitle>
            <CardDescription className="text-violet-100">
              {userSession
                ? `Selamat datang kembali, ${userSession.full_name}`
                : "Masuk ke dashboard pribadi untuk melihat notifikasi"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            {userSession ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-4 rounded-lg border-l-4 border-violet-500">
                  <p className="font-medium text-violet-800 mb-1">Akun Aktif</p>
                  <p className="text-sm text-violet-700">{userSession.email}</p>
                </div>
                <Link href="/user/dashboard">
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-medium py-3">
                    <User className="mr-2 h-4 w-4" />
                    Buka Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Masuk ke akun Anda untuk mengakses dashboard pribadi, melihat notifikasi dari administrator, dan
                  mengelola profil Anda.
                </p>
                <Link href="/user/login">
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-medium py-3">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login Pengguna
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5" />
              Cari Riwayat Data Anda
            </CardTitle>
            <CardDescription className="text-emerald-100">
              Masukkan nomor telepon untuk melihat hasil pemeriksaan sebelumnya
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="space-y-4">
              <div>
                <Label htmlFor="searchPhone" className="text-gray-700 font-medium">
                  Nomor Telepon
                </Label>
                <Input
                  id="searchPhone"
                  type="tel"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="mt-2 border-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-3"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mencari Data...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Cari Riwayat Data
                  </>
                )}
              </Button>
            </div>

            {showResults && (
              <div className="mt-6 border-t pt-6">
                {searchResults.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium">Tidak ada data ditemukan</p>
                    <p className="text-xs text-gray-400 mt-1">untuk nomor telepon ini</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-teal-600" />
                      Riwayat Pemeriksaan Anda ({searchResults.length})
                    </h4>
                    {searchResults.map((result, index) => (
                      <div
                        key={result.id || index}
                        className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-lg">{result.nama}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Building2 className="h-3 w-3" />
                              {result.nama_puskesmas}
                            </p>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDepressionCategoryColor(result.depression_category)}`}
                          >
                            {result.depression_category}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="text-center bg-white/60 p-2 rounded-lg">
                            <div className="text-xl font-bold text-teal-700">{result.total_depression_score}</div>
                            <div className="text-xs text-gray-600">Skor Depresi</div>
                          </div>
                          <div className="text-center bg-white/60 p-2 rounded-lg">
                            <div className="text-xl font-bold text-purple-700">{result.total_anxiety_score}</div>
                            <div className="text-xs text-gray-600">Skor Kecemasan</div>
                          </div>
                        </div>

                        <div className="bg-white/80 p-3 rounded-lg border-l-4 border-l-teal-500">
                          <p className="text-sm text-gray-700 font-medium mb-1">Rekomendasi Depresi:</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {getDepressionRiskMessage(result.depression_category, result.total_depression_score)}
                          </p>
                          <p className="text-sm text-gray-700 font-medium mt-2 mb-1">Rekomendasi Kecemasan:</p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {getAnxietyRiskMessage(result.anxiety_category, result.total_anxiety_score)}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-l-blue-500">
                      <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-blue-800 font-medium text-sm">Catatan Penting</p>
                          <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                            Anda dapat mengisi kuesioner berulang kali untuk memantau perkembangan kondisi kesehatan
                            mental selama kehamilan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Informasi Penelitian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 bg-white">
            <div className="text-center mb-4">
              <img
                src="/fitri.jpg"
                alt="Logo Universitas Hasanuddin"
                className="w-50 h-50 mx-auto rounded-full border-4 border-blue-100 shadow-md"
              />
            </div>

            <p className="font-medium text-gray-800 text-center">Assalamu'alaikum Warahmatullahi Wabarakatuh</p>

            <p className="text-gray-700 text-sm leading-relaxed">
              Saya <strong>Fitriani Sukardi, SKM</strong>, Mahasiswa Program Magister Ilmu Kesehatan Masyarakat
              Universitas Hasanuddin Konsentrasi Epidemiologi Lapangan. Penelitian ini bertujuan untuk mengetahui
              kondisi kesehatan mental ibu hamil di Kabupaten Jeneponto.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-500">
              <p className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Tujuan Penelitian
              </p>
              <p className="text-blue-700 text-sm leading-relaxed">
                Mengetahui gejala depresi dan kecemasan ibu hamil primigravida trimester 3 di Kabupaten Jeneponto,
                Sulawesi Selatan Tahun 2025.
              </p>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border-l-4 border-emerald-500">
              <p className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Jaminan Kerahasiaan
              </p>
              <p className="text-emerald-700 text-sm leading-relaxed">
                Semua informasi yang Anda berikan akan dijaga kerahasiaannya. Partisipasi bersifat sukarela dan Anda
                dapat mengundurkan diri kapan saja.
              </p>
            </div>

            <Card className="mb-6 shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5" />
                  Manfaat Berpartisipasi
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Dengan berpartisipasi, Anda akan mendapatkan:
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Kondisi Kesehatan Mental Terkini</p>
                      <p className="text-sm text-gray-600">
                        Ibu hamil dapat mengetahui kondisi kesehatan mental Anda secara objektif.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-pink-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Pendampingan Menyenangkan</p>
                      <p className="text-sm text-gray-600">
                        Bagi ibu hamil yang terindikasi masalah kesehatan mental akan mendapatkan pendampingan yang
                        menyenangkan.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-rose-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Pengetahuan Persiapan Menyambut Bayi</p>
                      <p className="text-sm text-gray-600">
                        Dapatkan informasi dan pengetahuan penting tentang persiapan menyambut bayi Anda.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Baby className="h-5 w-5 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">Kesempatan Sukses Mengasihi Lebih Besar</p>
                      <p className="text-sm text-gray-600">
                        Tingkatkan peluang Anda untuk sukses dalam memberikan ASI eksklusif.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="text-center pt-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4">
              <p className="text-xs text-gray-600 mb-1">Peneliti:</p>
              <p className="font-semibold text-gray-800">Fitriani Sukardi, SKM</p>
              <p className="text-sm text-blue-600 font-medium">📞 082284577558</p>
              <p className="text-xs text-gray-500 mt-2">Makassar, 7 Mei 2025</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-1">
            <CardHeader className="bg-white m-1 rounded">
              <CardTitle className="flex items-center justify-center gap-2 text-lg text-gray-800">
                <Baby className="h-6 w-6 text-pink-600" />
                Untuk Ibu Hamil Trimester 3
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Dengan melanjutkan, Ibu menyetujui untuk berpartisipasi dalam penelitian ini secara sukarela
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent className="p-6 bg-white">
            <Link href="/consent">
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg font-medium py-4 text-lg"
                size="lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Saya Bersedia Berpartisipasi
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            <CardTitle className="flex items-center justify-center gap-2 text-lg">
              <Shield className="h-6 w-6" />
              Akses Peneliti & Administrator
            </CardTitle>
            <CardDescription className="text-emerald-100 text-center">
              Portal khusus untuk tim peneliti dan administrator sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <Link href="/admin/login">
              <Button
                variant="outline"
                className="w-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-medium py-3 bg-transparent"
                size="lg"
              >
                <Shield className="mr-2 h-5 w-5" />
                Masuk Portal Admin
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500 pb-8 space-y-2">
          <p className="flex items-center justify-center gap-2">
            <Shield className="h-3 w-3" />
            Data Anda akan disimpan dengan aman dan rahasia
          </p>
          <p className="text-gray-400">© 2025 Universitas Hasanuddin - Program Magister Kesehatan Masyarakat</p>
        </div>
      </div>
    </div>
  )
}
