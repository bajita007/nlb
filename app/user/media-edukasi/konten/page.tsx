"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Heart,
    Waves,
    Brain,
    Headphones,
    Activity,
    Lightbulb,
    BookOpen,
    ZoomIn,
    X,
    Download,
    Play,
    Music,
    Video,
    ImageIcon,
    ArrowLeft,
} from "lucide-react"
import { UserLayout } from "@/components/user-layout"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function MediaKontenPage() {
    const [selectedMedia, setSelectedMedia] = useState<any>(null)

    const mediaCategories = [
        {
            title: "Hipnoterapi",
            description: "Teknik relaksasi mendalam untuk mengurangi stres dan kecemasan selama kehamilan",
            icon: Brain,
            color: "from-purple-500 to-indigo-600",
            bgColor: "from-purple-50 to-indigo-50",
            iconColor: "text-purple-600",
            media: [
                {
                    url: "/music-placeholder.png",
                    title: "AFIRMASI IBU HAMIL PERSALINAN LANCAR KEHAMILAN SEHAT",
                    type: "audio",
                    downloadUrl: "/media/hipnoterapi/AFIRMASI IBU HAMIL PERSALINAN LANCAR KEHAMILAN SEHAT.mp3",
                },
                {
                    url: "/music-placeholder.png",
                    title: "Afirmasi Positif untuk Hamil Sehat bagi Bumil _ Relaksasi Kesehatan Ibu Hamil",
                    type: "audio",
                    downloadUrl: "/media/hipnoterapi/Afirmasi Positif untuk Hamil Sehat bagi Bumil _ Relaksasi Kesehatan Ibu Hamil.mp3",
                },
                {
                    url: "/video-placeholder.png",
                    title: "Bagaimana Caranya Kalimat Positif Dapat Membantu Persalinan",
                    type: "video",
                    downloadUrl: "/media/hipnoterapi/Bagaimana Caranya Kalimat Positif Dapat Membantu Persalinan .mp4",
                },
                {
                    url: "/music-placeholder.png",
                    title: "BIMBINGAN KETENANGAN PIKIRAN SAAT HAMIL (Lepaskan Cemas & Khawatir)",
                    type: "audio",
                    downloadUrl: "/media/hipnoterapi/BIMBINGAN KETENANGAN PIKIRAN SAAT HAMIL (Lepaskan Cemas & Khawatir).mp3",
                },
            ],
        },
        {
            title: "Hidroterapi",
            description: "Terapi air untuk relaksasi otot dan mengurangi ketegangan tubuh",
            icon: Waves,
            color: "from-blue-500 to-cyan-600",
            bgColor: "from-blue-50 to-cyan-50",
            iconColor: "text-blue-600",
            media: [
                {
                    url: "/music-placeholder.png",
                    title: "Heal [N°171]",
                    type: "audio",
                    downloadUrl: "/media/hidroterapi/Heal [N°171].mp3",
                },
                {
                    url: "/media/hidroterapi/Hidroterapi.jpg",
                    title: "Hidroterapi",
                    type: "image",
                    downloadUrl: "/media/hidroterapi/Hidroterapi.jpg",
                },
                {
                    url: "/music-placeholder.png",
                    title: "Learn To See [N°170]",
                    type: "audio",
                    downloadUrl: "/media/hidroterapi/Learn To See [N°170].mp3",
                },
                {
                    url: "/music-placeholder.png",
                    title: "Recharge [N°169]",
                    type: "audio",
                    downloadUrl: "/media/hidroterapi/Recharge [N°169].mp3",
                },
            ],
        },
        {
            title: "Mindfulness",
            description: "Latihan kesadaran penuh untuk ketenangan pikiran dan emosi",
            icon: Heart,
            color: "from-emerald-500 to-teal-600",
            bgColor: "from-emerald-50 to-teal-50",
            iconColor: "text-emerald-600",
            media: [
                {
                    url: "/music-placeholder.png",
                    title: "Sering Merasa Overthingking  Lakukan Meditasi Mindfulness Ini Untuk Mengatasinya!",
                    type: "audio",
                    downloadUrl: "/media/mindfullness/Sering Merasa Overthingking  Lakukan Meditasi Mindfulness Ini Untuk Mengatasinya!.mp3",
                },
                {
                    url: "/media/mindfullness/mindfullness.jpg",
                    title: "mindfullness",
                    type: "image",
                    downloadUrl: "/media/hidroterapi/mindfullness.jpg",
                },
            ],
        },
        {
            title: "Terapi Musik Lembut",
            description: "Musik relaksasi khusus untuk ibu hamil dan perkembangan janin",
            icon: Headphones,
            color: "from-pink-500 to-rose-600",
            bgColor: "from-pink-50 to-rose-50",
            iconColor: "text-pink-600",
            media: [
                {
                    url: "/video-placeholder.png",
                    title: "Heal [N°171]",
                    type: "video",
                    downloadUrl: "/media/terapi/Heal [N°171].mp4",
                },
                {
                    url: "/media/terapi/terapi musik lembut.jpg",
                    title: "Terapi musik lembut",
                    type: "image",
                    downloadUrl: "/media/terapi/terapi musik lembut.jpg",
                },
                {
                    url: "/video-placeholder.png",
                    title: "Learn To See [N°170]",
                    type: "video",
                    downloadUrl: "/media/terapi/Learn To See [N°170].mp4",
                },
                {
                    url: "/video-placeholder.png",
                    title: "Recharge [N°169]",
                    type: "video",
                    downloadUrl: "/media/terapi/Recharge [N°169].mp4",
                },
            ],
        },
        {
            title: "Yoga dan Tips Nafas",
            description: "Gerakan yoga aman dan teknik pernapasan untuk ibu hamil",
            icon: Activity,
            color: "from-orange-500 to-amber-600",
            bgColor: "from-orange-50 to-amber-50",
            iconColor: "text-orange-600",
            media: [
                {
                    url: "/video-placeholder.png",
                    title: "IBU & ANAK_ Yoga Prenatal untuk Persiapan Persalinan",
                    type: "video",
                    downloadUrl: "/media/yoga/IBU & ANAK_ Yoga Prenatal untuk Persiapan Persalinan.mp4",
                },
                {
                    url: "/video-placeholder.png",
                    title: "PANDUAN MUDAH YOGA IBU HAMIL TRIMESTER 3 DI RUMAH",
                    type: "video",
                    downloadUrl: "/media/yoga/PANDUAN MUDAH YOGA IBU HAMIL TRIMESTER 3 DI RUMAH.mp4",
                },
                {
                    url: "/video-placeholder.png",
                    title: "Latihan Pernafasan selama hamil sampai persalinan, agar melahirkan lebih nyaman bersama Tasya Kamila",
                    type: "video",
                    downloadUrl: "/media/yoga/Latihan Pernafasan selama hamil sampai persalinan, agar melahirkan lebih nyaman bersama Tasya Kamila.mp4",
                },
                {
                    url: "/video-placeholder.png",
                    title: "Teknik Bernafas Untuk Kurangi Kecemasan pada Ibu Hamil _ Prenatal Yoga Part 11",
                    type: "video",
                    downloadUrl: "/media/yoga/Teknik Bernafas Untuk Kurangi Kecemasan pada Ibu Hamil _ Prenatal Yoga Part 11.mp4",
                },
                {
                    url: "/video-placeholder.png",
                    title: "Yoga Mengurangi Nyeri Tulang Pinggang dan Punggung bersama Jamilatus Sa diyah",
                    type: "video",
                    downloadUrl: "/media/yoga/Yoga Mengurangi Nyeri Tulang Pinggang dan Punggung bersama Jamilatus Sa diyah (1).mp4",
                },
                {
                    url: "/video-placeholder.png",
                    title: "Mengurangi Nyeri Persalinan Dengan Endorfin Massage",
                    type: "video",
                    downloadUrl: "/media/yoga/Mengurangi Nyeri Persalinan Dengan Endorfin Massage.mp4",
                },
            ],
        },

    ]

    const openMediaModal = (media: any) => {
        setSelectedMedia(media)
    }

    const closeMediaModal = () => {
        setSelectedMedia(null)
    }

    const getMediaIcon = (type: string) => {
        switch (type) {
            case "video":
                return <Video className="h-4 w-4" />
            case "audio":
                return <Music className="h-4 w-4" />
            default:
                return <ImageIcon className="h-4 w-4" />
        }
    }

    const getMediaTypeColor = (type: string) => {
        switch (type) {
            case "video":
                return "bg-red-100 text-red-700"
            case "audio":
                return "bg-green-100 text-green-700"
            default:
                return "bg-blue-100 text-blue-700"
        }
    }

    const handleDownload = (downloadUrl: string, filename: string) => {
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const renderMediaContent = (media: any) => {
        if (media.type === "video") {
            return (
                <video
                    src={media.downloadUrl}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                    poster={media.url}
                >
                    <source src={media.downloadUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )
        } else if (media.type === "audio") {
            return (
                <div className="space-y-4">
                    <Image
                        src={media.url || "/placeholder.svg"}
                        alt={media.title}
                        width={800}
                        height={600}
                        className="w-full h-auto max-h-[40vh] object-contain rounded-lg"
                    />
                    <audio src={media.downloadUrl} controls autoPlay loop className="w-full">
                        <source src={media.downloadUrl} type="audio/mpeg" />
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            )
        } else {
            return (
                <Image
                    src={media.url || "/placeholder.svg"}
                    alt={media.title}
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                />
            )
        }
    }

    return (
        <UserLayout>
            <div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl p-4 space-y-6">
                {/* Back Button */}
                <div className="flex items-center gap-2">
                    <Link href="/user/media-edukasi">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Galeri Inspirasi
                        </Button>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-full">
                            <BookOpen className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Terapi</h1>
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
                            kesejahteraan mental selama masa kehamilan. Klik pada media untuk melihat lebih detail dan unduh untuk
                            akses offline.
                        </p>
                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-lg border-l-4 border-cyan-500">
                            <p className="text-cyan-800 text-xs font-medium">
                                Tip: Klik media untuk memperbesar dan gunakan tombol download untuk menyimpan. Gunakan media ini secara
                                rutin untuk hasil optimal.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Media Categories */}
                <div className="space-y-6">
                    {mediaCategories.map((category, categoryIndex) => {
                        const IconComponent = category.icon
                        return (
                            <Card key={categoryIndex} className="shadow-lg border-0 overflow-hidden">
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

                                <CardContent className="p-4 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {category.media.map((media, mediaIndex) => (
                                            <div key={mediaIndex} className="relative group cursor-pointer">
                                                <div
                                                    className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                                                    onClick={() => openMediaModal(media)}
                                                >
                                                    <Image
                                                        src={media.url || "/placeholder.svg"}
                                                        alt={media.title}
                                                        width={400}
                                                        height={300}
                                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div
                                                        className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getMediaTypeColor(media.type)}`}
                                                    >
                                                        {getMediaIcon(media.type)}
                                                        {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
                                                    </div>
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                        {media.type === "video" ? (
                                                            <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                        ) : media.type === "audio" ? (
                                                            <Music className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                        ) : (
                                                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <h4 className="font-medium text-gray-800 text-sm">{media.title}</h4>
                                                    {/* <p className="text-gray-600 text-xs mt-1">{media.description}</p> */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2 w-full bg-transparent"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDownload(media.downloadUrl, media.title)
                                                        }}
                                                    >
                                                        <Download className="h-3 w-3 mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                                <p>Klik pada media untuk melihat detail dan gunakan tombol download untuk menyimpan</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Media tersedia dalam format gambar, video, dan audio sesuai kebutuhan</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Pastikan Anda dalam posisi yang nyaman saat menggunakan media terapi</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Media ini melengkapi, bukan menggantikan perawatan medis profesional</p>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!selectedMedia} onOpenChange={closeMediaModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span>{selectedMedia?.title}</span>
                                {selectedMedia && (
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getMediaTypeColor(selectedMedia.type)}`}
                                    >
                                        {getMediaIcon(selectedMedia.type)}
                                        {selectedMedia.type.charAt(0).toUpperCase() + selectedMedia.type.slice(1)}
                                    </span>
                                )}
                            </div>

                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-6 pb-6">
                        {selectedMedia && (
                            <div className="space-y-4">
                                <div className="relative">{renderMediaContent(selectedMedia)}</div>
                                <div className="text-center">
                                    <p className="text-gray-600 mb-4">{selectedMedia.description}</p>
                                    <Button
                                        onClick={() => handleDownload(selectedMedia.downloadUrl, selectedMedia.title)}
                                        className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download {selectedMedia.type.charAt(0).toUpperCase() + selectedMedia.type.slice(1)}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </UserLayout>
    )
}
