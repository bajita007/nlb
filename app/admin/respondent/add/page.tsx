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
import { ArrowLeft, UserPlus, Heart, Users, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createRespondent } from "@/app/actions/admin-crud-actions"
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

export default function AddRespondentPage() {
  const router = useRouter()
  const { toast } = useToast()
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
    // Check localStorage authentication
    const adminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (adminLoggedIn !== "true") {
      router.push("/admin/login")
    }
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

    // Validation
    const isFormValid =
      formData.nama &&
      formData.tanggalLahir &&
      formData.alamat &&
      formData.nomorTelepon &&
      formData.kuesioner.every((score) => score !== -1)

    if (!isFormValid) {
      toast({
        title: "Form Tidak Lengkap",
        description: "Mohon lengkapi semua field yang diperlukan dan jawab semua kuesioner.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const result = await createRespondent({
        ...formData,
        totalDepressionScore: formData.totalDepressionScore,
        depressionCategory: formData.depressionCategory,
        totalAnxietyScore: formData.totalAnxietyScore,
        anxietyCategory: formData.anxietyCategory,
      })

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Data responden berhasil ditambahkan",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat menambahkan data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding respondent:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menambahkan data",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-700">
        <div className="relative px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="text-white">
                <h1 className="text-2xl font-bold">Tambah Responden Baru</h1>
                <p className="text-teal-100 text-sm">Input data responden dan kuesioner EPDS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Biodata Section */}
            <Card className="shadow-xl border-0 xl:col-span-1">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Data Diri Responden
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
              </CardContent>
            </Card>

            {/* Sosial Ekonomi Section */}
            <Card className="shadow-xl border-0 xl:col-span-1">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Data Sosial & Ekonomi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
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
                      <SelectItem value="Buruh">Buruh</SelectItem>
                      <SelectItem value="Petani">Petani</SelectItem>
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
                  <Label>Dukungan Suami</Label>
                  <RadioGroup
                    value={formData.dukunganSuami}
                    onValueChange={(value) => handleInputChange("dukunganSuami", value)}
                    className="mt-2"
                  >
                    {["Sangat Mendukung", "Mendukung", "Kurang Mendukung", "Tidak Mendukung"].map((option) => (
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
                    {["Sangat Mendukung", "Mendukung", "Kurang Mendukung", "Tidak Mendukung"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`dukungan-keluarga-${option}`} />
                        <Label htmlFor={`dukungan-keluarga-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Kesehatan & Kuesioner Section */}
            <Card className="shadow-xl border-0 xl:col-span-1">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Kesehatan & Riwayat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label>Riwayat Antidepresan</Label>
                  <RadioGroup
                    value={formData.riwayatAntidepresan}
                    onValueChange={(value) => handleInputChange("riwayatAntidepresan", value)}
                    className="mt-2"
                  >
                    {["Tidak Pernah", "Pernah", "Sedang Menggunakan"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`antidepresan-${option}`} />
                        <Label htmlFor={`antidepresan-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Riwayat Keluarga Antidepresan</Label>
                  <RadioGroup
                    value={formData.riwayatKeluargaAntidepresan}
                    onValueChange={(value) => handleInputChange("riwayatKeluargaAntidepresan", value)}
                    className="mt-2"
                  >
                    {["Tidak Ada", "Ada", "Tidak Tahu"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`keluarga-antidepresan-${option}`} />
                        <Label htmlFor={`keluarga-antidepresan-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="namaAnggotaKeluarga">Nama Anggota Keluarga Terdekat</Label>
                  <Input
                    id="namaAnggotaKeluarga"
                    value={formData.namaAnggotaKeluarga}
                    onChange={(e) => handleInputChange("namaAnggotaKeluarga", e.target.value)}
                    placeholder="Nama keluarga terdekat"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="riwayatMasalahKesehatan">Riwayat Masalah Kesehatan</Label>
                  <Textarea
                    id="riwayatMasalahKesehatan"
                    value={formData.riwayatMasalahKesehatan}
                    onChange={(e) => handleInputChange("riwayatMasalahKesehatan", e.target.value)}
                    placeholder="Masalah kesehatan yang pernah dialami"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Masalah Kehamilan Saat Ini</Label>
                  <div className="mt-2 space-y-2">
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
          </div>

          {/* Kuesioner EPDS Section */}
          <Card className="shadow-xl border-0 mt-8">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Kuesioner EPDS (Edinburgh Postnatal Depression Scale)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-3">
                      {question.id}. {question.text}
                    </h3>
                    <RadioGroup
                      value={formData.kuesioner[index]?.toString() || ""}
                      onValueChange={(value) => handleKuestionerChange(index, Number.parseInt(value))}
                    >
                      {question.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value.toString()} id={`q${question.id}-${option.value}`} />
                          <Label htmlFor={`q${question.id}-${option.value}`} className="text-sm">
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

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white px-8 py-3 text-lg"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Data Responden"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
