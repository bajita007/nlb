"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { getActiveQuestions } from "@/app/actions/questionnaire-actions"
import { submitPosttest } from "@/app/actions/posttest-actions"
import type { QuestionnaireQuestion } from "@/types/database"

export default function PosttestQuestionnairePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [biodataInfo, setBiodataInfo] = useState<any>(null)

useEffect(() => {
  const biodata = sessionStorage.getItem("posttest_biodata");

  if (!biodata) {
    toast({
      title: "Error",
      description: "Data biodata tidak ditemukan. Silakan isi biodata terlebih dahulu.",
      variant: "destructive",
      id: ""
    });
    router.push("/posttest-biodata");
    return;
  }

                // user_id:userData.id ,
      // full_name: userData.full_name || "",
      // phone_number: userData.phone_number || "",
  setBiodataInfo(JSON.parse(biodata));
  loadQuestions();
}, []); // ✅ Fix: run only once


  const loadQuestions = async () => {
    try {
      const result = await getActiveQuestions()
      if (result.success && result.data) {
        setQuestions(result.data)
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat pertanyaan",
          variant: "destructive",
          id: ""
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat pertanyaan",
        variant: "destructive",
        id: ""
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (value: number) => {
    const questionNumber = questions[currentQuestionIndex].question_number
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Convert answers to array format
      const answersArray = questions.map((q) => answers[q.question_number] || 0)

      const result = await submitPosttest(answersArray, biodataInfo)

      if (result.success) {
        // Clear biodata from session storage
        sessionStorage.removeItem("posttest_biodata")
        setIsCompleted(true)
        toast({
          title: "Berhasil",
          description: "Posttest berhasil diselesaikan",
          id: ""
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal menyimpan posttest",
          variant: "destructive",
          id: ""
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan posttest",
        variant: "destructive",
        id: ""
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pertanyaan...</p>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-4">
          <Card className="text-center shadow-xl">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-800">Posttest Selesai!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-green-800 font-medium">Terima kasih, {biodataInfo?.full_name}!</p>
                <p className="text-green-700 text-sm mt-1">Posttest Anda telah berhasil diselesaikan dan tersimpan.</p>
              </div>
              <p className="text-gray-600 text-sm">
                Hasil posttest akan digunakan untuk keperluan penelitian dan analisis kondisi kesehatan mental ibu
                hamil.
              </p>
              <Button onClick={() => router.push("/")} className="w-full">
                Kembali ke Beranda
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-4">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">Tidak ada pertanyaan yang tersedia saat ini.</p>
              <Button onClick={() => router.push("/")} className="mt-4">
                Kembali ke Beranda
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const currentAnswer = answers[currentQuestion.question_number]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const canProceed = currentAnswer !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto px-4 py-8">
        {/* Biodata Info Card */}
        {biodataInfo && (
          <Card className="mb-6 shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Informasi Peserta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white">
              <div className="text-sm text-gray-700">
                <p>
                  <strong>Nama:</strong> {biodataInfo.full_name}
                </p>
                {biodataInfo.phone_number && (
                  <p>
                    <strong>Telepon:</strong> {biodataInfo.phone_number}
                  </p>
                )}
                <p>
                  <strong>Alamat:</strong> {biodataInfo.alamat}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questionnaire Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Posttest EPDS</h1>
              <span className="text-sm text-teal-100">
                {currentQuestionIndex + 1} dari {questions.length}
              </span>
            </div>
            <Progress value={progress} className="w-full bg-teal-200" />
          </CardHeader>
          <CardContent className="space-y-6 p-6 bg-white">
            <div>
              <h2 className="text-lg font-medium mb-4">
                {currentQuestion.question_number}. {currentQuestion.question_text}
              </h2>

              <div className="space-y-3">
                {currentQuestion.scoring_options.map((option) => (
                  <div key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleAnswerChange(option.value)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        currentAnswer === option.value
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            currentAnswer === option.value ? "border-blue-500 bg-blue-500" : "border-gray-300"
                          }`}
                        >
                          {currentAnswer === option.value && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{option.label}</div>
                          {option.description && <div className="text-sm text-gray-500 mt-1">{option.description}</div>}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sebelumnya
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Selesai
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={!canProceed}>
                  Selanjutnya
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
