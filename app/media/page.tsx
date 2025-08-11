"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Music, Waves, Brain, Headphones, Activity, Lightbulb, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function MediaPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=300&width=800"
            alt="Media terapi background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-4 py-8">
          <div className="max-w-md mx-auto">
            <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Link>
            <div className="text-center text-white">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                  <Music className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Media Terapi & Relaksasi</h1>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Koleksi media untuk mendukung kesehatan mental dan kesejahteraan Anda selama kehamilan
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 relative z-10">
        {/* Introduction Card */}
        <Card className="mb-6 shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5" />
              Tentang Media Terapi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Media terapi ini dirancang khusus untuk membantu ibu hamil mengelola stres, kecemasan, dan meningkatkan
              kesejahteraan mental selama masa kehamilan. Setiap kategori berisi konten yang aman dan bermanfaat.
            </p>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-lg border-l-4 border-cyan-500">
              <p className="text-cyan-800 text-xs font-medium">
                💡 Tip: Gunakan media ini secara rutin untuk hasil yang optimal. Konsultasikan dengan bidan atau dokter
                jika ada pertanyaan.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Media Categories */}
        <div className="space-y-4 mb-8">
          {mediaCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Card key={index} className="shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-shadow">
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
        <Card className="mb-6 shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5" />
              Catatan Penting
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
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

        {/* Back to Home Button */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-6 bg-white">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 font-medium py-3 bg-transparent"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Kembali ke Beranda
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500 pb-8 space-y-2">
          <p className="flex items-center justify-center gap-2">
            <Heart className="h-3 w-3" />
            Media terapi untuk kesehatan mental ibu hamil
          </p>
          <p className="text-gray-400">© 2025 Universitas Hasanuddin - Program Magister Kesehatan Masyarakat</p>
        </div>
      </div>
    </div>
  )
}
