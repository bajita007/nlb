"use client"

import React from "react";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function PosttestBiodataPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    alamat: "",

       
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.full_name.trim()) {
      toast({
        title: "Error",
        description: "Nama wajib diisi",
        variant: "destructive",
      })
      return
    }

    if (!formData.alamat.trim()) {
      toast({
        title: "Error",
        description: "Alamat wajib diisi",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Store biodata in session storage (not in database)
      sessionStorage.setItem("posttest_biodata", JSON.stringify(formData))

      // Navigate to questionnaire
      router.push("/posttest-questionnaire")
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan, silakan coba lagi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.full_name.trim() && formData.alamat.trim()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-6 w-6" />
              Data Diri untuk Posttest
            </CardTitle>
            <p className="text-blue-100 text-sm">
              Silakan isi data diri Anda sebelum melanjutkan ke kuesioner posttest
            </p>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="full_name" className="text-gray-700 font-medium">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone_number" className="text-gray-700 font-medium">
                  Nomor Telepon <span className="text-gray-400">(Opsional)</span>
                </Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="08xxxxxxxxxx"
                  className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="alamat" className="text-gray-700 font-medium">
                  Alamat <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat lengkap Anda"
                  className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 text-sm">
                  <strong>Catatan:</strong> Data ini hanya digunakan untuk keperluan posttest dan tidak akan disimpan
                  dalam database utama penelitian.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Link href="/">
                  <Button variant="outline" type="button">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Kembali
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Lanjut ke Kuesioner
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
