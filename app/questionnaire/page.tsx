"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Info, Heart, Brain, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { submitRespondentData } from "../actions/respondent-actions"
import { getAllHealthUnits } from "../actions/health-unit-actions"
import { getAllQuestions } from "../actions/questionnaire-actions"
import { useToast } from "@/components/ui/use-toast"
import type { HealthUnit, QuestionnaireQuestion } from "@/types/database"

interface FormData {
  respondentNumber: string
  userId: string
  deviceId: string
  namaPuskesmas: string // Tetap menggunakan nama_puskesmas sesuai tabel
  nama: string
  tanggalLahir: string
  alamat: string
  nomorTelepon: string
  beratBadan: string
  tinggiBadan: string
  lila: string
  pendidikan: string
  pekerjaan: string
  statusPernikahan: string
  pekerjaanSuami: string
  pendidikanSuami: string
  riwayatAntidepresan: string
  riwayatKeluargaAntidepresan: string
  dukunganSuami: string
  dukunganKeluarga: string
  namaAnggotaKeluarga: string
  riwayatMasalahKesehatan: string
  masalahKehamilan: string[]
  kuesioner: number[]
  totalDepressionScore: number // New state for depression score
  depressionCategory: string // New state for depression category
  totalAnxietyScore: number // New state for anxiety score
  anxietyCategory: string // New state for anxiety category
}

const masalahKehamilanOptions = [
  "Anemia",
  "Hiperemesis",
  "Kehamilan lemah",
  "Hipertensi selama kehamilan",
  "Diabetes selama kehamilan",
  "Ancaman lahir prematur",
  "Berat janin kurang",
  "Kehamilan tidak direncanakan/tidak diinginkan",
]

export default function QuestionnairePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [healthUnits, setHealthUnits] = useState<HealthUnit[]>([])
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    respondentNumber: "",
    userId: "",
    deviceId: "",
    namaPuskesmas: "",
    nama: "",
    tanggalLahir: "",
    alamat: "",
    nomorTelepon: "",
    beratBadan: "",
    tinggiBadan: "",
    lila: "",
    pendidikan: "",
    pekerjaan: "",
    statusPernikahan: "",
    pekerjaanSuami: "",
    pendidikanSuami: "",
    riwayatAntidepresan: "",
    riwayatKeluargaAntidepresan: "",
    dukunganSuami: "",
    dukunganKeluarga: "",
    namaAnggotaKeluarga: "",
    riwayatMasalahKesehatan: "",
    masalahKehamilan: [],
    kuesioner: [],
    totalDepressionScore: 0,
    depressionCategory: "",
    totalAnxietyScore: 0,
    anxietyCategory: "",
  })

  useEffect(() => {
    // Check if consent was given
    const consentGiven = localStorage.getItem("consentGiven")
    if (!consentGiven) {
      router.push("/consent")
      return
    }

    // Generate User ID and get Device ID
    const userId = "user_" + crypto.randomUUID()
    const deviceId = localStorage.getItem("deviceId") || "device_unknown"

    setFormData((prev) => ({
      ...prev,
      userId,
      deviceId,
    }))

    // Load data from database
    loadData()
  }, [router])

  // Update scores and categories whenever kuesioner changes
  useEffect(() => {
    const depressionScore = calculateDepressionScore()
    const depressionCat = getDepressionCategory(depressionScore)
    const anxietyScore = calculateAnxietyScore()
    const anxietyCat = getAnxietyCategory(anxietyScore)

    setFormData((prev) => ({
      ...prev,
      totalDepressionScore: depressionScore,
      depressionCategory: depressionCat,
      totalAnxietyScore: anxietyScore,
      anxietyCategory: anxietyCat,
    }))
  }, [formData.kuesioner])

  const loadData = async () => {
    try {
      setIsLoadingData(true)

      // Load health units and questions
      const [healthUnitsResult, questionsResult] = await Promise.all([getAllHealthUnits(), getAllQuestions()])

      if (healthUnitsResult.success) {
        setHealthUnits(healthUnitsResult.data || [])
      }

      if (questionsResult.success) {
        const activeQuestions = (questionsResult.data || []).filter((q) => q.is_active)
        setQuestions(activeQuestions)
        // Initialize kuesioner array with -1 for each question
        setFormData((prev) => ({
          ...prev,
          kuesioner: new Array(activeQuestions.length).fill(-1),
        }))
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data. Menggunakan data default.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMasalahKehamilanChange = (option: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      masalahKehamilan: checked
        ? [...prev.masalahKehamilan, option]
        : prev.masalahKehamilan.filter((item) => item !== option),
    }))
  }

  const handleKuestionerChange = (questionIndex: number, value: number) => {
    setFormData((prev) => ({
      ...prev,
      kuesioner: prev.kuesioner.map((item, index) => (index === questionIndex ? value : item)),
    }))
  }

  const calculateDepressionScore = () => {
    return formData.kuesioner.reduce((sum, score) => sum + (score === -1 ? 0 : score), 0)
  }

  const getDepressionCategory = (score: number) => {
    if (score >= 13 && score <= 20) return "Sedang-Berat"
    if (score >= 10 && score <= 12) return "Ringan-Sedang"
    if (score >= 0 && score <= 9) return "Sangat Ringan"
    if (score > 20) return "Berat"
    return "Tidak Diketahui"
  }

  const calculateAnxietyScore = () => {
    // Questions 3, 4, 5 are at indices 2, 3, 4 in a 0-indexed array
    const anxietyScores = [formData.kuesioner[2], formData.kuesioner[3], formData.kuesioner[4]].filter(
      (score) => score !== -1,
    ) // Filter out unanswered questions
    return anxietyScores.reduce((sum, score) => sum + score, 0)
  }

  const getAnxietyCategory = (score: number) => {
    if (score >= 7 && score <= 9) return "Berat"
    if (score >= 4 && score <= 6) return "Ringan hingga Sedang"
    if (score >= 0 && score <= 3) return "Tidak ada gejala atau Ringan"
    return "Tidak Diketahui"
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const result = await submitRespondentData({
        ...formData,
        totalDepressionScore: formData.totalDepressionScore,
        depressionCategory: formData.depressionCategory,
        totalAnxietyScore: formData.totalAnxietyScore,
        anxietyCategory: formData.anxietyCategory,
      })

      if (result.success) {
        // Store the necessary data in localStorage before redirecting
        localStorage.setItem(
          "lastRespondentData",
          JSON.stringify({
            respondentNumber: result.data.respondent_number,
            nama: result.data.nama,
            nomorTelepon: result.data.nomor_telepon,
            depressionCategory: result.data.depression_category,
            anxietyCategory: result.data.anxiety_category,
          }),
        )
        toast({
          title: "Berhasil",
          description: "Data berhasil disimpan",
          variant: "default",
        })
        router.push("/questionnaire/success")
      } else {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat menyimpan data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStep1Valid =
    formData.nama &&
    formData.tanggalLahir &&
    formData.alamat &&
    formData.nomorTelepon &&
    formData.namaPuskesmas &&
    formData.beratBadan &&
    formData.tinggiBadan &&
    formData.lila &&
    formData.pendidikan &&
    formData.pekerjaan &&
    formData.statusPernikahan &&
    formData.pekerjaanSuami &&
    formData.pendidikanSuami &&
    formData.riwayatAntidepresan &&
    formData.riwayatKeluargaAntidepresan &&
    formData.dukunganSuami &&
    formData.dukunganKeluarga

  const isKuestionerValid = formData.kuesioner.every((score) => score !== -1)

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-indigo-600 font-medium">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header with Image */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=200&width=800"
            alt="Kuesioner kesehatan mental"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="text-sm text-white/90">
                {step === 1 ? (
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Data Diri
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Kuesioner
                  </div>
                )}
              </div>
            </div>

            <div className="text-center text-white">
              <h1 className="text-2xl font-bold mb-2">INSTRUMEN PENELITIAN</h1>
              <p className="text-purple-100 text-sm leading-relaxed mb-1">
                Kesehatan Mental Ibu Hamil Primigravida Trimester 3
              </p>
              <p className="text-purple-200 text-xs">Kabupaten Jeneponto, Sulawesi Selatan - 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 relative z-10">
        {/* Research Info Card */}
        <Card className="mb-6 shadow-lg border-0">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg mb-2">INSTRUMEN PENELITIAN</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                Kesehatan Mental Ibu Hamil Primigravida Trimester 3
              </p>
              <p className="text-gray-500 text-xs mb-4">Kabupaten Jeneponto, Sulawesi Selatan - 2025</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
              <div className="text-center">
                <p className="text-gray-600">Tanggal Wawancara</p>
                <p className="font-medium">{new Date().toLocaleDateString("id-ID")}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Device ID</p>
                <p className="font-mono text-xs text-gray-500">{formData.deviceId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {step === 1 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Data Diri Responden
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Personal Data Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Data Pribadi</h3>

                <div>
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Tempat Konsultasi
                  </Label>
                  <Select
                    value={formData.namaPuskesmas}
                    onValueChange={(value) => handleInputChange("namaPuskesmas", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih tempat konsultasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {healthUnits
                        .filter((unit) => unit.is_active)
                        .map((unit) => (
                          <SelectItem key={unit.id} value={unit.name}>
                            {unit.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Pilih tempat Anda biasa kontrol kehamilan</p>
                </div>

                <div>
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => handleInputChange("nama", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                  <Input
                    id="tanggalLahir"
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => handleInputChange("tanggalLahir", e.target.value)}
                    className="mt-1"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <Label htmlFor="alamat">Alamat</Label>
                  <Textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) => handleInputChange("alamat", e.target.value)}
                    placeholder="Masukkan alamat lengkap"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="nomorTelepon">Nomor Telepon</Label>
                  <Input
                    id="nomorTelepon"
                    type="tel"
                    value={formData.nomorTelepon}
                    onChange={(e) => handleInputChange("nomorTelepon", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Physical Data Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Data Fisik</h3>

                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800 text-sm">💡 Petunjuk:</p>
                      <p className="text-blue-700 text-sm">
                        Untuk data LILA (Lingkar Lengan Atas), silakan cek <strong>Buku KIA</strong> Anda atau tanyakan
                        kepada bidan/petugas kesehatan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="beratBadan">Berat Badan (kg)</Label>
                    <Input
                      id="beratBadan"
                      type="number"
                      value={formData.beratBadan}
                      onChange={(e) => handleInputChange("beratBadan", e.target.value)}
                      placeholder="60"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tinggiBadan">Tinggi Badan (cm)</Label>
                    <Input
                      id="tinggiBadan"
                      type="number"
                      value={formData.tinggiBadan}
                      onChange={(e) => handleInputChange("tinggiBadan", e.target.value)}
                      placeholder="160"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lila">LILA - Lingkar Lengan Atas (cm)</Label>
                  <Input
                    id="lila"
                    type="number"
                    value={formData.lila}
                    onChange={(e) => handleInputChange("lila", e.target.value)}
                    placeholder="25"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Cek di Buku KIA atau tanyakan bidan</p>
                </div>
              </div>

              {/* Education & Work Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Pendidikan & Pekerjaan</h3>

                <div>
                  <Label>Pendidikan Terakhir</Label>
                  <RadioGroup
                    value={formData.pendidikan}
                    onValueChange={(value) => handleInputChange("pendidikan", value)}
                    className="mt-2"
                  >
                    {["SD", "SMP", "SMA", "Perguruan Tinggi"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`pendidikan-${option}`} />
                        <Label htmlFor={`pendidikan-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Pekerjaan</Label>
                  <Select value={formData.pekerjaan} onValueChange={(value) => handleInputChange("pekerjaan", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih pekerjaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IRT">IRT</SelectItem>
                      <SelectItem value="Karyawan Swasta">Karyawan Swasta</SelectItem>
                      <SelectItem value="Wirausaha">Wirausaha</SelectItem>
                      <SelectItem value="ASN">ASN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Marriage & Spouse Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Data Pernikahan & Suami</h3>

                <div>
                  <Label>Status Pernikahan</Label>
                  <RadioGroup
                    value={formData.statusPernikahan}
                    onValueChange={(value) => handleInputChange("statusPernikahan", value)}
                    className="mt-2"
                  >
                    {["Belum Menikah", "Menikah tercatat", "Menikah tidak tercatat"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`status-${option}`} />
                        <Label htmlFor={`status-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Pekerjaan Suami</Label>
                  <Select
                    value={formData.pekerjaanSuami}
                    onValueChange={(value) => handleInputChange("pekerjaanSuami", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih pekerjaan suami" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Karyawan Swasta">Karyawan Swasta</SelectItem>
                      <SelectItem value="Wirausaha">Wirausaha</SelectItem>
                      <SelectItem value="ASN">ASN</SelectItem>
                      <SelectItem value="Petani">Petani</SelectItem>
                      <SelectItem value="Nelayan">Nelayan</SelectItem>
                      <SelectItem value="Tidak bekerja">Tidak bekerja</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Pendidikan Suami</Label>
                  <RadioGroup
                    value={formData.pendidikanSuami}
                    onValueChange={(value) => handleInputChange("pendidikanSuami", value)}
                    className="mt-2"
                  >
                    {["SD", "SMP", "SMA", "Perguruan Tinggi"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`pendidikan-suami-${option}`} />
                        <Label htmlFor={`pendidikan-suami-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              {/* Health & Support Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2">Riwayat Kesehatan & Dukungan</h3>

                <div>
                  <Label>Riwayat Konsumsi Antidepresan</Label>
                  <RadioGroup
                    value={formData.riwayatAntidepresan}
                    onValueChange={(value) => handleInputChange("riwayatAntidepresan", value)}
                    className="mt-2"
                  >
                    {["Tidak pernah", "Pernah", "Sementara"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`antidepresan-${option}`} />
                        <Label htmlFor={`antidepresan-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Riwayat Keluarga Konsumsi Antidepresan</Label>
                  <RadioGroup
                    value={formData.riwayatKeluargaAntidepresan}
                    onValueChange={(value) => handleInputChange("riwayatKeluargaAntidepresan", value)}
                    className="mt-2"
                  >
                    {["Tidak ada", "Ada, pernah ada", "Ada, sementara konsumsi"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`keluarga-antidepresan-${option}`} />
                        <Label htmlFor={`keluarga-antidepresan-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Dukungan Suami</Label>
                  <RadioGroup
                    value={formData.dukunganSuami}
                    onValueChange={(value) => handleInputChange("dukunganSuami", value)}
                    className="mt-2"
                  >
                    {["Sangat baik", "Baik", "Cukup", "Kurang baik", "Sangat tidak baik"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`dukungan-suami-${option}`} />
                        <Label htmlFor={`dukungan-suami-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Dukungan Keluarga</Label>
                  <RadioGroup
                    value={formData.dukunganKeluarga}
                    onValueChange={(value) => handleInputChange("dukunganKeluarga", value)}
                    className="mt-2"
                  >
                    {["Sangat baik", "Baik", "Cukup", "Kurang baik", "Sangat tidak baik"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`dukungan-keluarga-${option}`} />
                        <Label htmlFor={`dukungan-keluarga-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="namaAnggotaKeluarga">Nama Anggota Keluarga Pendukung</Label>
                  <Input
                    id="namaAnggotaKeluarga"
                    value={formData.namaAnggotaKeluarga}
                    onChange={(e) => handleInputChange("namaAnggotaKeluarga", e.target.value)}
                    placeholder="Nama anggota keluarga"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="riwayatMasalahKesehatan">Riwayat Masalah Kesehatan Sebelum Hamil</Label>
                  <Textarea
                    id="riwayatMasalahKesehatan"
                    value={formData.riwayatMasalahKesehatan}
                    onChange={(e) => handleInputChange("riwayatMasalahKesehatan", e.target.value)}
                    placeholder="Jelaskan riwayat masalah kesehatan (jika ada)"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Masalah Saat Kehamilan</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {masalahKehamilanOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`masalah-${option}`}
                          checked={formData.masalahKehamilan.includes(option)}
                          onCheckedChange={(checked) => handleMasalahKehamilanChange(option, checked as boolean)}
                        />
                        <Label htmlFor={`masalah-${option}`} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                disabled={!isStep1Valid}
                size="lg"
              >
                Lanjut ke Kuesioner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Kuesioner Kesehatan Mental
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Karena Anda saat ini hamil, kami ingin mengetahui bagaimana perasaan Anda sekarang. Silahkan memilih
                    jawaban yang paling mirip dengan perasaan Anda selama <strong>7 hari terakhir</strong>, tidak hanya
                    perasaan Anda hari ini.
                  </p>
                </div>

                <p className="font-medium text-gray-800">
                  Silakan menjawab pertanyaan-pertanyaan berikut sebagaimana diatas.
                </p>
              </div>

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-sm font-medium leading-relaxed text-gray-800 block mb-3">
                      {question.question_number}. {question.question_text}
                    </Label>
                    <RadioGroup
                      value={formData.kuesioner[index]?.toString()}
                      onValueChange={(value) => handleKuestionerChange(index, Number.parseInt(value))}
                    >
                      {question.scoring_options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value.toString()} id={`q${question.id}-${option.value}`} />
                          <Label htmlFor={`q${question.id}-${option.value}`} className="text-sm leading-relaxed">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  disabled={!isKuestionerValid || isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Jawaban"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
