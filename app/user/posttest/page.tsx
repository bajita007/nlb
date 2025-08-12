"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { UserLayout } from "@/components/user-layout"
import { useToast } from "@/components/ui/use-toast"
import { getActiveQuestions } from "@/app/actions/questionnaire-actions"
import { submitPosttest } from "@/app/actions/posttest-actions"
import type { QuestionnaireQuestion } from "@/types/database"


export default function PosttestPage() {
  const { toast } = useToast()
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
   const [userData, setUserData] = useState<any>(null)


  useEffect(() => {
    const userString = localStorage.getItem('userData')
    if (userString) setUserData(JSON.parse(userString))
    loadQuestions()
  }, [])

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

  const handleAnswerChange = (value: string) => {
    const questionNumber = questions[currentQuestionIndex].question_number
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: Number.parseInt(value),
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

      const result = await submitPosttest(answersArray,userData)

      if (result.success) {
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
      <UserLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat pertanyaan...</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  if (isCompleted) {
    return (
      <UserLayout>
        <div className="mx-auto p-4">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-800">Posttest Selesai!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Terima kasih telah menyelesaikan posttest. Hasil akan tersedia di dashboard Anda.
              </p>
              <Button onClick={() => (window.location.href = "/user/dashboard")} className="w-full">
                Kembali ke Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </UserLayout>
    )
  }

  if (questions.length === 0) {
    return (
      <UserLayout>
        <div className="max-w-md mx-auto p-4">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">Tidak ada pertanyaan yang tersedia saat ini.</p>
            </CardContent>
          </Card>
        </div>
      </UserLayout>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const currentAnswer = answers[currentQuestion.question_number]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const canProceed = currentAnswer !== undefined

  return (
    <UserLayout>
      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Posttest EPDS</h1>
              <span className="text-sm text-gray-500">
                {currentQuestionIndex + 1} dari {questions.length}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">
                {currentQuestion.question_number}. {currentQuestion.question_text}
              </h2>

              <RadioGroup
                value={currentAnswer?.toString() || ""}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestion.scoring_options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">{option.label}</div>
                        {option.description && <div className="text-sm text-gray-500">{option.description}</div>}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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
                  {isSubmitting ? "Menyimpan..." : "Selesai"}
                  <CheckCircle className="h-4 w-4 ml-2" />
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
    </UserLayout>
  )
}
