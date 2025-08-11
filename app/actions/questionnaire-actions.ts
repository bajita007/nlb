"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getAllQuestions() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("questionnaire_questions")
      .select("*")
      .order("question_number", { ascending: true })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching questions:", error)
    return { success: false, error: "Failed to fetch questions", data: [] }
  }
}

export async function getActiveQuestions() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("questionnaire_questions")
      .select("*")
      .eq("is_active", true)
      .order("question_number", { ascending: true })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching active questions:", error)
    return { success: false, error: "Failed to fetch questions", data: [] }
  }
}

export async function createQuestion(formData: any) {
  try {
    const supabase = createServerSupabaseClient()

    const questionData = {
      question_number: formData.question_number,
      question_text: formData.question_text,
      scoring_options: formData.scoring_options,
      is_active: formData.is_active ?? true,
    }

    const { error } = await supabase.from("questionnaire_questions").insert(questionData)

    if (error) throw error

    revalidatePath("/admin/questionnaire")
    return { success: true }
  } catch (error) {
    console.error("Error creating question:", error)
    return { success: false, error: "Failed to create question" }
  }
}

export async function updateQuestion(id: string, formData: any) {
  try {
    const supabase = createServerSupabaseClient()

    const updateData = {
      question_number: formData.question_number,
      question_text: formData.question_text,
      scoring_options: formData.scoring_options,
      is_active: formData.is_active,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("questionnaire_questions").update(updateData).eq("id", id)

    if (error) throw error

    revalidatePath("/admin/questionnaire")
    return { success: true }
  } catch (error) {
    console.error("Error updating question:", error)
    return { success: false, error: "Failed to update question" }
  }
}

export async function deleteQuestion(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("questionnaire_questions").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/questionnaire")
    return { success: true }
  } catch (error) {
    console.error("Error deleting question:", error)
    return { success: false, error: "Failed to delete question" }
  }
}

export async function getQuestionById(id: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("questionnaire_questions").select("*").eq("id", id).single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching question:", error)
    return { success: false, error: "Failed to fetch question" }
  }
}

export async function toggleQuestionStatus(id: string, isActive: boolean) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from("questionnaire_questions")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/questionnaire")
    return { success: true }
  } catch (error) {
    console.error("Error toggling question status:", error)
    return { success: false, error: "Failed to update question status" }
  }
}
