"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getRespondentByIdForEdit, updateRespondent } from "@/app/actions/admin-crud-actions"
import { checkAdminAuth } from "@/app/actions/auth-actions"
import { useToast } from "@/components/ui/use-toast"

const questions = [
  {
    id: 1,
    text: "Saya dapat tertawa dan melihat segi kelucuan hal-hal tertentu:",
    options: [
      { value: 0, label: "Seperti biasanya" },
      { value: 1, label: "Sekarang tidak terlalu sering" },
      { value: 2, label: "Sekarang agak jarang" },
      { value: 3, label: "Tidak sama sekali" },
    ],
  },
  {
    id: 2,
    text: "Saya menanti-nanti untuk melakukan sesuatu dengan penuh harapan:",
    options: [
      { value: 0, label: "Hampir seperti biasanya" },
      { value: 1, label: "Agak berkurang dari biasanya" },
      { value: 2, label: "Jelas kurang dari biasanya" },
      { value: 3, label: "Hampir tidak sama sekali" },
    ],
  },
  {
    id: 3,
    text: "Saya menyalahkan diri sendiri jika ada sesuatu yang tidak berjalan dengan baik:",
    options: [
      { value: 0, label: "Tidak, tidak pernah" },
      { value: 1, label: "Tidak, tidak terlalu sering" },
      { value: 2, label: "Ya, kadang-kadang" },
      { value: 3, label: "Ya, hampir selalu" },
    ],
  },
  {
    id: 4,
    text: "Saya merasa cemas atau kuatir tanpa alasan:",
    options: [
      { value: 0, label: "Tidak, tidak sama sekali" },
      { value: 1, label: "Hampir tidak pernah" },
      { value: 2, label: "Ya, kadang-kadang" },
      { value: 3, label: "Ya, amat sering" },
    ],
  },
  {
    id: 5,
    text: "Saya merasa takut atau panik tanpa alasan:",
    options: [
      { value: 0, label: "Tidak, tidak pernah sama sekali" },
      { value: 1, label: "Tidak, tidak perlu" },
      { value: 2, label: "Ya, kadang-kadang" },
      { value: 3, label: "Ya, sering sekali" },
    ],
  },
  {
    id: 6,
    text: "Banyak hal menjadi beban untuk saya:",
    options: [
      { value: 0, label: "Tidak, saya dapat mengatasinya dengan baik seperti biasanya" },
      { value: 1, label: "Tidak, biasanya saya dapat mengatasinya dengan baik" },
      { value: 2, label: "Ya, kadang saya tidak dapat mengatasi seperti biasanya" },
      { value: 3, label: "Ya, seringkali saya sama sekali tidak dapat mengatasinya" },
    ],
  },
  {
    id: 7,
    text: "Saya merasa begitu sedih sampai sulit tidur:",
    options: [
      { value: 0, label: "Tidak, tidak pernah" },
      { value: 1, label: "Tidak, tidak sering" },
      { value: 2, label: "Ya, kadang-kadang" },
      { value: 3, label: "Ya, hampir selalu" },
    ],
  },
  {
    id: 8,
    text: "Saya merasa sedih atau susah:",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Jarang" },
      { value: 2, label: "Ya, sering" },
      { value: 3, label: "Ya, hampir selalu" },
    ],
  },
  {
    id: 9,
    text: "Saya merasa sangat sedih sehingga saya menangis:",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Hanya sekali-kali" },
      { value: 2, label: "Ya, sering" },
      { value: 3, label: "Ya, hampir selalu" },
    ],
  },
  {
    id: 10,
    text: "Pikiran untuk mencelakai diri sendiri sering muncul:",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Hampir tidak pernah" },
      { value: 2, label: "Kadang-kadang" },
      { value: 3, label: "Ya, agak sering" },
    ],
  },
]

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

const puskesmasOptions = [
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

export default function EditRespondentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nama: "",
    tanggalLahir: "",
    alamat: "",
    nomorTelepon: "",
    namaPuskesmas: "",
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
    masalahKehamilan: [] as string[],
    kuesioner: new Array(10).fill(-1),
    totalDepressionScore: 0, // New state for depression score
    depressionCategory: "", // New state for depression category
    totalAnxietyScore: 0, // New state for anxiety score
    anxietyCategory: "", // New state for anxiety category
  })

  useEffect(() => {
    async function loadData() {
      const { authenticated } = await checkAdminAuth()
      if (!authenticated) {
        router.push("/admin/login")
        return
      }

      try {
        const result = await getRespondentByIdForEdit(params.id)
        if (result.success && result.data) {
          const data = result.data
          setFormData({
            nama: data.nama || "",
            tanggalLahir: data.tanggal_lahir || "",
            alamat: data.alamat || "",
            nomorTelepon: data.nomor_telepon || "",
            namaPuskesmas: data.nama_puskesmas || "",
            beratBadan: data.berat_badan || "",
            tinggiBadan: data.tinggi_badan || "",
            lila: data.lila || "",
            pendidikan: data.pendidikan || "",
            pekerjaan: data.pekerjaan || "",
            statusPernikahan: data.status_pernikahan || "",
            pekerjaanSuami: data.pekerjaan_suami || "",
            pendidikanSuami: data.pendidikan_suami || "",
            riwayatAntidepresan: data.riwayat_antidepresan || "",
            riwayatKeluargaAntidepresan: data.riwayat_keluarga_antidepresan || "",
            dukunganSuami: data.dukungan_suami || "",
            dukunganKeluarga: data.dukungan_keluarga || "",
            namaAnggotaKeluarga: data.nama_anggota_keluarga || "",
            riwayatMasalahKesehatan: data.riwayat_masalah_kesehatan || "",
            masalahKehamilan: data.masalah_kehamilan || [],
            kuesioner: data.kuesioner || new Array(10).fill(-1),
            totalDepressionScore: data.total_depression_score || 0,
            depressionCategory: data.depression_category || "",
            totalAnxietyScore: data.total_anxiety_score || 0,
            anxietyCategory: data.anxiety_category || "",
          })
        } else {
          toast({
            title: "Error",
            description: "Data responden tidak ditemukan",
            variant: "destructive",
          })
          router.push("/admin/dashboard")
        }
      } catch (error) {
        console.error("Error loading respondent:", error)
        toast({
          title: "Error",
          description: "Gagal memuat data responden",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id, router, toast])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      const result = await updateRespondent(params.id, {
        ...formData,
        totalDepressionScore: formData.totalDepressionScore,
        depressionCategory: formData.depressionCategory,
        totalAnxietyScore: formData.totalAnxietyScore,
        anxietyCategory: formData.anxietyCategory,
      })

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Data responden berhasil diperbarui",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat memperbarui data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating respondent:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui data",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-indigo-600 font-medium">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-700">
        <div className="relative px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="text-white">
                <h1 className="text-2xl font-bold">Edit Data Responden</h1>
                <p className="text-orange-100 text-sm">Perbarui data responden dan kuesioner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Biodata Section */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Data Diri Responden
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => handleInputChange("nama", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                  <Input
                    id="tanggalLahir"
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => handleInputChange("tanggalLahir", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="alamat">Alamat *</Label>
                  <Textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) => handleInputChange("alamat", e.target.value)}
                    placeholder="Masukkan alamat lengkap"
                    className="mt-1"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nomorTelepon">Nomor Telepon *</Label>
                  <Input
                    id="nomorTelepon"
                    type="tel"
                    value={formData.nomorTelepon}
                    onChange={(e) => handleInputChange("nomorTelepon", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label>Nama Puskesmas/Rumah Sakit</Label>
                  <Select
                    value={formData.namaPuskesmas}
                    onValueChange={(value) => handleInputChange("namaPuskesmas", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih puskesmas/rumah sakit" />
                    </SelectTrigger>
                    <SelectContent>
                      {puskesmasOptions.map((puskesmas) => (
                        <SelectItem key={puskesmas} value={puskesmas}>
                          {puskesmas}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                  <div>
                    <Label htmlFor="lila">LILA (cm)</Label>
                    <Input
                      id="lila"
                      type="number"
                      value={formData.lila}
                      onChange={(e) => handleInputChange("lila", e.target.value)}
                      placeholder="25"
                      className="mt-1"
                    />
                  </div>
                </div>

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
              </CardContent>
            </Card>

            {/* Questionnaire Section */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle>Edit Kuesioner Kesehatan Mental</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                      <Label className="text-sm font-medium leading-relaxed text-gray-800 block mb-3">
                        {question.id}. {question.text}
                      </Label>
                      <RadioGroup
                        value={formData.kuesioner[index]?.toString()}
                        onValueChange={(value) => handleKuestionerChange(index, Number.parseInt(value))}
                      >
                        {question.options.map((option) => (
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
                {/* Score Preview */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Skor Depresi:</span>
                    <span className="text-xl font-bold text-blue-600">{formData.totalDepressionScore}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Kategori Depresi:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getDepressionCategory(formData.totalDepressionScore) === "Sangat Ringan"
                          ? "bg-green-100 text-green-800"
                          : getDepressionCategory(formData.totalDepressionScore) === "Ringan-Sedang"
                            ? "bg-yellow-100 text-yellow-800"
                            : getDepressionCategory(formData.totalDepressionScore) === "Sedang-Berat"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formData.depressionCategory}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium">Total Skor Kecemasan (Q3-5):</span>
                    <span className="text-xl font-bold text-purple-600">{formData.totalAnxietyScore}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Kategori Kecemasan:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getAnxietyCategory(formData.totalAnxietyScore) === "Tidak ada gejala atau Ringan"
                          ? "bg-green-100 text-green-800"
                          : getAnxietyCategory(formData.totalAnxietyScore) === "Ringan hingga Sedang"
                            ? "bg-yellow-100 text-yellow-800"
                            : getAnxietyCategory(formData.totalAnxietyScore) === "Berat"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {formData.anxietyCategory}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memperbarui...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Perbarui Data Responden
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
