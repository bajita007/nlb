"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Brain, Heart, AlertTriangle, CheckCircle, FileText, BarChart3 } from "lucide-react"
import { UserLayout } from "@/components/user-layout"
import { useToast } from "@/components/ui/use-toast"
import { getUserPosttestResults } from "@/app/actions/posttest-actions"
import { getUserSession } from "@/lib/auth"

interface PosttestResult {
  id: string
  user_id: string
  user_name: string
  user_phone: string
  answers: number[]
  total_depression_score: number
  depression_category: string
  total_anxiety_score: number
  anxiety_category: string
  submitted_at: string
  created_at: string
}

export default function HasilPosttestPage() {
  const { toast } = useToast()
  const [results, setResults] = useState<PosttestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      const userSession = getUserSession()
      if (!userSession) {
        toast({
          title: "Error",
          description: "Silakan login terlebih dahulu",
          variant: "destructive",
          id: ""
        })
        return
      }

      const result = await getUserPosttestResults(userSession.id)
      if (result.success && result.data) {
        setResults(result.data)
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat hasil posttest",
          variant: "destructive",
          id: ""
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
        id: ""
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryColor = (category: string) => {
    if (category.includes("Normal")) return "bg-green-100 text-green-800"
    if (category.includes("Ringan")) return "bg-yellow-100 text-yellow-800"
    if (category.includes("Sedang")) return "bg-orange-100 text-orange-800"
    if (category.includes("Berat") || category.includes("Tinggi")) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  const getCategoryIcon = (category: string) => {
    if (category.includes("Normal")) return <CheckCircle className="h-4 w-4" />
    if (category.includes("Ringan")) return <AlertTriangle className="h-4 w-4" />
    if (category.includes("Sedang")) return <AlertTriangle className="h-4 w-4" />
    if (category.includes("Berat") || category.includes("Tinggi")) return <AlertTriangle className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const getLatestResult = () => {
    if (results.length === 0) return null
    return results[0] // Results are ordered by created_at desc
  }

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat hasil posttest...</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  const latestResult = getLatestResult()

  return (
    <UserLayout>
      <div className="mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hasil Posttest</h1>
          <p className="text-gray-600 text-sm">Riwayat hasil evaluasi kesehatan mental Anda</p>
        </div>

        {results.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Belum ada hasil posttest</p>
              <Button onClick={() => (window.location.href = "/user/posttest")}>Mulai Posttest</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Latest Result Summary */}
            {latestResult && (
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Hasil Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Brain className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Skor Depresi</p>
                      <p className="text-2xl font-bold text-purple-600">{latestResult.total_depression_score}</p>
                      <Badge className={`mt-2 ${getCategoryColor(latestResult.depression_category)}`}>
                        {getCategoryIcon(latestResult.depression_category)}
                        <span className="ml-1">{latestResult.depression_category}</span>
                      </Badge>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <Heart className="h-8 w-8 mx-auto text-pink-600 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Skor Kecemasan</p>
                      <p className="text-2xl font-bold text-pink-600">{latestResult.total_anxiety_score}</p>
                      <Badge className={`mt-2 ${getCategoryColor(latestResult.anxiety_category)}`}>
                        {getCategoryIcon(latestResult.anxiety_category)}
                        <span className="ml-1">{latestResult.anxiety_category}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {formatDate(latestResult.submitted_at)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Results History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Riwayat Posttest ({results.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className={`p-4 border-b last:border-b-0 ${index === 0 ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            {index === 0 ? "Terbaru" : `#${results.length - index}`}
                          </Badge>
                          <span className="text-sm text-gray-500">{formatDate(result.submitted_at)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded border">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium">Depresi</span>
                          </div>
                          <p className="text-lg font-bold text-purple-600 mb-1">{result.total_depression_score}</p>
                          <Badge className={`text-xs ${getCategoryColor(result.depression_category)}`}>
                            {result.depression_category}
                          </Badge>
                        </div>

                        <div className="bg-white p-3 rounded border">
                          <div className="flex items-center gap-2 mb-1">
                            <Heart className="h-4 w-4 text-pink-600" />
                            <span className="text-sm font-medium">Kecemasan</span>
                          </div>
                          <p className="text-lg font-bold text-pink-600 mb-1">{result.total_anxiety_score}</p>
                          <Badge className={`text-xs ${getCategoryColor(result.anxiety_category)}`}>
                            {result.anxiety_category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600 mb-4 text-sm">Ingin melakukan evaluasi ulang?</p>
                <Button onClick={() => (window.location.href = "/user/posttest")} className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  Mulai Posttest Baru
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </UserLayout>
  )
}
