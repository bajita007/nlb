"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, FileCheck, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ConsentPage() {
  const router = useRouter()
  const [consents, setConsents] = useState({
    voluntary: false,
    confidentiality: false,
    dataUsage: false,
    withdrawal: false,
    contact: false,
  })

  const handleConsentChange = (key: string, checked: boolean) => {
    setConsents((prev) => ({
      ...prev,
      [key]: checked,
    }))
  }

  const allConsentsGiven = Object.values(consents).every((consent) => consent)

  const handleProceed = () => {
    if (allConsentsGiven) {
      localStorage.setItem("consentGiven", "true")
      localStorage.setItem("consentTimestamp", new Date().toISOString())
      router.push("/questionnaire")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header with Image */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=300&width=800"
            alt="Informed consent"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="text-sm text-white/90">Persetujuan Penelitian</div>
            </div>
            <div className="text-center text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                  <FileCheck className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Informed Consent</h1>
              <p className="text-blue-100">Persetujuan Setelah Penjelasan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-6 w-6" />
              Informed Consent (Persetujuan Setelah Penjelasan)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-800 mb-2">📋 Penelitian:</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                "Kondisi Kesehatan Ibu Hamil Primigravida Trimester 3 di Kabupaten Jeneponto Sulawesi Selatan Tahun
                2025"
              </p>
              <p className="text-blue-600 text-xs mt-2">Oleh: Fitriani Sukardi, SKM - Universitas Hasanuddin</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="voluntary"
                  checked={consents.voluntary}
                  onCheckedChange={(checked) => handleConsentChange("voluntary", checked as boolean)}
                />
                <Label htmlFor="voluntary" className="text-sm leading-relaxed">
                  Saya memahami bahwa partisipasi dalam penelitian ini bersifat <strong>sukarela</strong> dan saya dapat
                  mengundurkan diri kapan saja tanpa konsekuensi apapun.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="confidentiality"
                  checked={consents.confidentiality}
                  onCheckedChange={(checked) => handleConsentChange("confidentiality", checked as boolean)}
                />
                <Label htmlFor="confidentiality" className="text-sm leading-relaxed">
                  Saya memahami bahwa <strong>identitas dan informasi</strong> yang saya berikan akan dijaga
                  kerahasiaannya oleh peneliti.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="dataUsage"
                  checked={consents.dataUsage}
                  onCheckedChange={(checked) => handleConsentChange("dataUsage", checked as boolean)}
                />
                <Label htmlFor="dataUsage" className="text-sm leading-relaxed">
                  Saya menyetujui penggunaan data yang saya berikan untuk <strong>kepentingan penelitian</strong> dan
                  publikasi ilmiah dengan tetap menjaga kerahasiaan identitas.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="withdrawal"
                  checked={consents.withdrawal}
                  onCheckedChange={(checked) => handleConsentChange("withdrawal", checked as boolean)}
                />
                <Label htmlFor="withdrawal" className="text-sm leading-relaxed">
                  Saya memahami bahwa saya dapat <strong>mengundurkan diri</strong> dari penelitian ini kapan saja
                  dengan menghubungi peneliti.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="contact"
                  checked={consents.contact}
                  onCheckedChange={(checked) => handleConsentChange("contact", checked as boolean)}
                />
                <Label htmlFor="contact" className="text-sm leading-relaxed">
                  Saya memahami bahwa saya dapat <strong>menghubungi peneliti</strong> (Fitriani Sukardi, SKM - HP:
                  082284577558) jika ada pertanyaan atau kekhawatiran.
                </Label>
              </div>
            </div>

            {!allConsentsGiven && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-700">
                  Mohon centang semua persetujuan untuk melanjutkan ke kuesioner.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Tidak Bersedia
                </Button>
              </Link>
              <Button
                onClick={handleProceed}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                disabled={!allConsentsGiven}
              >
                Saya Setuju & Lanjutkan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-600">
                Dengan melanjutkan, Anda menyatakan telah membaca, memahami, dan menyetujui untuk berpartisipasi dalam
                penelitian ini.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Tanggal:{" "}
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
