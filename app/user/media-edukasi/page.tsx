
"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, BookOpen, ZoomIn, X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { UserLayout } from "@/components/user-layout"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function MediaEdukasiIntroPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)


  const motivationalImages = [
  {
    url: "/pengantar/1.png",
    title: "Motivasi Kesehatan Mental 1",
    description: "Pesan inspiratif untuk ibu hamil 1",
  },
  ...Array.from({ length: 47 }, (_, i) => i + 2) // bikin [2..48]
    .filter(num => num !== 5) // buang file 6
    .map((num, index) => ({
      url: `/pengantar/${num}.png`, // url asli (2..48 skip 6)
      title: `Motivasi Kesehatan Mental ${index + 2}`, // urutan rapi (2..47)
      description: `Pesan inspiratif untuk ibu hamil ${index + 2}`,
    })),
]
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeImageModal = () => {
    setSelectedImageIndex(null)
  }

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? motivationalImages.length - 1 : selectedImageIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === motivationalImages.length - 1 ? 0 : selectedImageIndex + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
    if (e.key === "Escape") closeImageModal()
  }

  const currentImage = selectedImageIndex !== null ? motivationalImages[selectedImageIndex] : null

  return (
    <UserLayout>
      <div className="mx-auto md:max-w-4xl lg:max-w-6xl p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Edukasi</h1>
          <p className="text-gray-600 text-sm">Inspirasi dan motivasi untuk perjalanan kehamilan yang sehat</p>
        </div>

        {/* Introduction Card */}
        <Card className="border-2 border-teal-200">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2 text-lg text-teal-800">
              <Heart className="h-5 w-5" />
              Selamat Datang di LENTERA BUNDA
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Temukan koleksi gambar inspiratif dan motivasi yang dirancang khusus untuk mendukung kesehatan mental ibu
              hamil. Setiap gambar mengandung pesan positif untuk membantu Anda melewati perjalanan kehamilan dengan
              penuh percaya diri dan kebahagiaan.
            </p>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-lg border-l-4 border-cyan-500">
              <p className="text-cyan-800 text-xs font-medium">
                Klik pada gambar untuk melihat lebih besar dan navigasi dengan slider. Gunakan panah kiri/kanan untuk
                berpindah gambar.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Images Grid */}
        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-1">
            <CardHeader className="bg-white m-1 rounded">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-pink-50 to-rose-50">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-800">Galeri Inspirasi</CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    48 gambar motivasi untuk kesehatan mental ibu hamil
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </div>

          <CardContent className="p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {motivationalImages.map((image, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <div
                    className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-pink-300 transition-colors"
                    onClick={() => openImageModal(index)}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.title}
                      width={400}
                      height={400}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {index + 1}/47
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-800 text-sm">{image.title}</h4>
                    <p className="text-gray-600 text-xs mt-1">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Media Terapi Card */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 mb-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Siap untuk Media Terapi?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Akses koleksi lengkap media terapi termasuk hipnoterapi, hidroterapi, mindfulness, musik relaksasi, dan
                yoga untuk mendukung kesehatan mental Anda.
              </p>
            </div>
            <Link href="/user/media-edukasi/konten">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3"
              >
                Jelajahi Media Terapi
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-2 border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
              <Heart className="h-5 w-5" />
              Tips Penggunaan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-gray-700 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Luangkan waktu untuk merefleksikan setiap pesan inspiratif</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Simpan gambar favorit Anda untuk motivasi harian</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Bagikan pesan positif dengan ibu hamil lainnya</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Gunakan sebagai pengingat bahwa Anda tidak sendirian</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Dialog open={selectedImageIndex !== null} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 flex flex-col" onKeyDown={handleKeyDown}>
          <DialogHeader className="p-4 pb-2 border-b flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">{currentImage?.title}</span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} / 47
                </span>
              </div>

            </DialogTitle>
          </DialogHeader>

          {/* Main Image Container */}
          <div className="relative flex-1 flex items-center justify-center bg-gray-50 min-h-[50vh] overflow-hidden">
            {currentImage && (
              <>
                {/* Main Image */}
                <div className="relative w-full h-full flex items-center justify-center py-4">
                  <Image
                    src={currentImage.url || "/placeholder.svg"}
                    alt={currentImage.title}
                    width={600}
                    height={400}
                    className="max-w-full max-h-[50vh] object-contain "
                    priority
               
                  />
                </div>

                {/* Navigation Buttons */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-20 w-10 h-10"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-20 w-10 h-10"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

            
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          <div className="border-t bg-gray-50 p-3 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
              {motivationalImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedImageIndex === index
                      ? "border-pink-500 ring-2 ring-pink-200 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=48&width=48&text=" + (index + 1)
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Instructions */}
          <div className="px-4 pb-3 flex-shrink-0">
            <p className="text-center text-xs text-gray-500">
              Gunakan tombol panah atau keyboard (←/→) untuk navigasi 
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </UserLayout>
  )
}
