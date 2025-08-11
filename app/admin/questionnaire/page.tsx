"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Brain, ToggleLeft, ToggleRight, Eye, EyeOff } from "lucide-react"
// Removed Download import
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/components/ui/use-toast"
import {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestionStatus,
} from "@/app/actions/questionnaire-actions"
// Removed XLSX import
import type { QuestionnaireQuestion } from "@/types/database"

export default function QuestionnairePage() {
  const { toast } = useToast()
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionnaireQuestion | null>(null)
  const [formData, setFormData] = useState({
    question_number: 1,
    question_text: "",
    scoring_options: [
      { value: 0, label: "", description: "" },
      { value: 1, label: "", description: "" },
      { value: 2, label: "", description: "" },
      { value: 3, label: "", description: "" },
    ],
    is_active: true,
  })

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      setIsLoading(true)
      const result = await getAllQuestions()

      if (result.success) {
        setQuestions(result.data || [])
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data pertanyaan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let result
      if (editingQuestion) {
        result = await updateQuestion(editingQuestion.id, formData)
      } else {
        result = await createQuestion(formData)
      }

      if (result.success) {
        toast({
          title: "Berhasil",
          description: editingQuestion ? "Pertanyaan berhasil diperbarui" : "Pertanyaan berhasil ditambahkan",
        })
        loadQuestions()
        resetForm()
      } else {
        toast({
          title: "Gagal",
          description: result.error || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (question: QuestionnaireQuestion) => {
    console.log("Editing question:", question)
    setEditingQuestion(question)
    setFormData({
      question_number: question.question_number || 1,
      question_text: question.question_text || "",
      scoring_options:
        question.scoring_options?.length > 0
          ? question.scoring_options.map((option) => ({
              value: option.value ?? 0,
              label: option.label || "",
              description: option.description || "",
            }))
          : [
              { value: 0, label: "", description: "" },
              { value: 1, label: "", description: "" },
              { value: 2, label: "", description: "" },
              { value: 3, label: "", description: "" },
            ],
      is_active: question.is_active ?? true,
    })
    console.log("Form data after edit setup:", formData)
    setIsDialogOpen(true)
  }

  const handleDelete = async (question: QuestionnaireQuestion) => {
    if (confirm(`Yakin ingin menghapus pertanyaan nomor ${question.question_number}?`)) {
      try {
        const result = await deleteQuestion(question.id)

        if (result.success) {
          toast({
            title: "Berhasil",
            description: "Pertanyaan berhasil dihapus",
          })
          loadQuestions()
        } else {
          toast({
            title: "Gagal",
            description: result.error || "Terjadi kesalahan",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat menghapus data",
          variant: "destructive",
        })
      }
    }
  }

  const handleToggleStatus = async (question: QuestionnaireQuestion) => {
    try {
      const result = await toggleQuestionStatus(question.id, !question.is_active)

      if (result.success) {
        toast({
          title: "Berhasil",
          description: `Pertanyaan ${question.is_active ? "dinonaktifkan" : "diaktifkan"}`,
        })
        loadQuestions()
      } else {
        toast({
          title: "Gagal",
          description: result.error || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengubah status",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    const nextQuestionNumber = questions.length > 0 ? Math.max(...questions.map((q) => q.question_number)) + 1 : 1

    setFormData({
      question_number: nextQuestionNumber,
      question_text: "",
      scoring_options: [
        { value: 0, label: "", description: "" },
        { value: 1, label: "", description: "" },
        { value: 2, label: "", description: "" },
        { value: 3, label: "", description: "" },
      ],
      is_active: true,
    })
    setEditingQuestion(null)
    setIsDialogOpen(false)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  // Removed handleExportToExcel function

  const updateScoringOption = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      scoring_options: prev.scoring_options.map((option, i) =>
        i === index
          ? {
              ...option,
              [field]: field === "value" ? Number(value) || 0 : String(value) || "",
            }
          : option,
      ),
    }))
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data pertanyaan...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Kuesioner EPDS</h1>
            <p className="text-gray-600">Kelola pertanyaan Edinburgh Postnatal Depression Scale</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pertanyaan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingQuestion ? "Edit Pertanyaan" : "Tambah Pertanyaan Baru"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="question_number">Nomor Pertanyaan</Label>
                    <Input
                      id="question_number"
                      type="number"
                      value={formData.question_number}
                      onChange={(e) => setFormData({ ...formData, question_number: Number.parseInt(e.target.value) })}
                      min="1"
                      max="20"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <Label htmlFor="is_active">Pertanyaan aktif</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="question_text">Teks Pertanyaan</Label>
                  <Textarea
                    id="question_text"
                    value={formData.question_text}
                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                    placeholder="Masukkan teks pertanyaan"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>Opsi Jawaban (Skor 0-3)</Label>
                  <div className="space-y-3 mt-2">
                    {formData.scoring_options.map((option, index) => (
                      <div key={index} className="border p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Skor {option.value}</Badge>
                        </div>
                        <div className="space-y-2">
                          <Input
                            placeholder="Label jawaban"
                            value={option.label}
                            onChange={(e) => updateScoringOption(index, "label", e.target.value)}
                            required
                          />
                          <Input
                            placeholder="Deskripsi (opsional)"
                            value={option.description}
                            onChange={(e) => updateScoringOption(index, "description", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingQuestion ? "Perbarui" : "Simpan"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          {/* Removed Export to Excel button */}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pertanyaan</p>
                  <p className="text-2xl font-bold">{questions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pertanyaan Aktif</p>
                  <p className="text-2xl font-bold">{questions.filter((q) => q.is_active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <EyeOff className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pertanyaan Nonaktif</p>
                  <p className="text-2xl font-bold">{questions.filter((q) => !q.is_active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pertanyaan Kuesioner</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Belum ada pertanyaan</p>
                <Button onClick={openAddDialog} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Pertanyaan Pertama
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No.</TableHead>
                      <TableHead>Pertanyaan</TableHead>
                      <TableHead>Opsi Jawaban</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>
                          <Badge variant="outline">{question.question_number}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="font-medium text-sm leading-relaxed">{question.question_text}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-600">{question.scoring_options.length} opsi jawaban</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                question.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }
                            >
                              {question.is_active ? "Aktif" : "Nonaktif"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleStatus(question)}
                              className="p-1"
                            >
                              {question.is_active ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(question)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleDelete(question)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
