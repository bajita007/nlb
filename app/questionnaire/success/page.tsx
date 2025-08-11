"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react" // Removed useState as respondentData is no longer displayed

export default function SuccessPage() {
  useEffect(() => {
    // Clear the stored data, even if not displayed, for cleanup
    localStorage.removeItem("lastRespondentData")
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-800">Terima Kasih!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              Terima kasih atas partisipasi Ibu dalam penelitian ini. Data yang Ibu berikan sangat berharga untuk
              kemajuan ilmu kesehatan masyarakat.
            </p>

            {/* Updated message */}
            <div className="bg-blue-50 p-4 rounded-lg text-center space-y-2">
              <p className="text-sm text-blue-700 font-medium">
                Silakan lihat hasil kuesioner Anda di beranda dengan memasukkan nomor telepon Anda.
              </p>
            </div>

            <p className="text-sm text-gray-500">
              Jika diperlukan, peneliti akan menghubungi Ibu untuk klarifikasi atau tindak lanjut. Semua data akan
              dijaga kerahasiaannya sesuai etika penelitian.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Kontak Peneliti:</strong>
                <br />
                Fitriani Sukardi, SKM
                <br />
                HP: 082284577558
                <br />
                Program Magister Kesehatan Masyarakat
                <br />
                Universitas Hasanuddin
              </p>
            </div>
            <Link href="/">
              <Button className="w-full mt-6">
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
