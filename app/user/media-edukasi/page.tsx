"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Waves, Brain, Headphones, Activity, Lightbulb, ExternalLink, BookOpen } from "lucide-react"
import { UserLayout } from "@/components/user-layout"

export default function MediaEdukasiPage() {
  const mediaCategories = [
    {
      title: "Hipnoterapi",
      description: "Teknik relaksasi mendalam untuk mengurangi stres dan kecemasan selama kehamilan",
      icon: Brain,
      url: "https://drive.google.com/drive/folders/1ITYR7NSC59lavP3_Ke9NkERu9K_HktuR",
      color: "from-purple-500 to-indigo-600",
      bgColor: "from-purple-50 to-indigo-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Hidroterapi",
      description: "Terapi air untuk relaksasi otot dan mengurangi ketegangan tubuh",
      icon: Waves,
      url: "https://drive.google.com/drive/folders/1csd8DP6w0QRK9onfarc0XdzTCs8L0l0N",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Mindfulness",
      description: "Latihan kesadaran penuh untuk ketenangan pikiran dan emosi",
      icon: Heart,
      url: "https://drive.google.com/drive/folders/1gTACwoJ0T6l0i8s0OlaXhDWyjIFlQ2eb",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Terapi Musik Lembut",
      description: "Musik relaksasi khusus untuk ibu hamil dan perkembangan janin",
      icon: Headphones,
      url: "https://drive.google.com/drive/folders/1_044EpgBjuip7EOJupb1TGGIdOrAn7-K",
      color: "from-pink-500 to-rose-600",
      bgColor: "from-pink-50 to-rose-50",
      iconColor: "text-pink-600",
    },
    {
      title: "Yoga dan Tips Nafas",
      description: "Gerakan yoga aman dan teknik pernapasan untuk ibu hamil",
      icon: Activity,
      url: "https://drive.google.com/drive/folders/1ZDU902lehvIVZlHg1xcfEeJ-qlqzwIBq",
      color: "from-orange-500 to-amber-600",
      bgColor: "from-orange-50 to-amber-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Lentera Bunda",
      description: "Panduan dan inspirasi khusus untuk perjalanan kehamilan Anda",
      icon: Lightbulb,
      url: "https://drive.google.com/drive/folders/1T2WXq6SqfoFEFqT-uk2x8C9duZtjSvtk",
      color: "from-violet-500 to-purple-600",
      bgColor: "from-violet-50 to-purple-50",
      iconColor: "text-violet-600",
    },
  ]

  return (
    <UserLayout>
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Edukasi</h1>
          <p className="text-gray-600 text-sm">Koleksi media untuk mendukung kesehatan mental dan kesejahteraan Anda</p>
        </div>

        {/* Introduction Card */}
        <Card className="border-2 border-teal-200">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2 text-lg text-teal-800">
              <Heart className="h-5 w-5" />
              Tentang Media Terapi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Media terapi ini dirancang khusus untuk membantu ibu hamil mengelola stres, kecemasan, dan meningkatkan
              kesejahteraan mental selama masa kehamilan. Setiap kategori berisi konten yang aman dan bermanfaat.
            </p>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-lg border-l-4 border-cyan-500">
              <p className="text-cyan-800 text-xs font-medium">
                Tip: Gunakan media ini secara rutin untuk hasil yang optimal. Konsultasikan dengan bidan atau dokter
                jika ada pertanyaan.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Media Categories */}
        <div className="space-y-4">
          {mediaCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Card key={index} className="shadow-lg border-0 overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${category.color} p-1`}>
                  <CardHeader className="bg-white m-1 rounded">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${category.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${category.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-800">{category.title}</CardTitle>
                        <CardDescription className="text-gray-600 text-sm">{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </div>
                <CardContent className="p-6 bg-white">
                  <a href={category.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button
                      className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90 text-white shadow-lg font-medium py-3 transition-all`}
                      size="lg"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Akses {category.title}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Important Notes */}
        <Card className="border-2 border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
              <Lightbulb className="h-5 w-5" />
              Catatan Penting
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-gray-700 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Semua media dapat diakses kapan saja sesuai kebutuhan Anda</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Pastikan Anda dalam posisi yang nyaman saat menggunakan media terapi</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Konsultasikan dengan tenaga kesehatan jika mengalami ketidaknyamanan</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Media ini melengkapi, bukan menggantikan perawatan medis profesional</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  )
}
