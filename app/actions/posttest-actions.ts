"use server"

import { UserSession } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"
// import { getUserSession } from "@/lib/auth"

function getDepressionCategory(score: number): string {
  if (score >= 13 && score <= 20) return "Sedang-Berat"
  if (score >= 10 && score <= 12) return "Ringan-Sedang"
  if (score >= 0 && score <= 9) return "Sangat Ringan"
  if (score > 20) return "Berat"
  return "Tidak Diketahui"
}

// Helper function to calculate anxiety category
function getAnxietyCategory(score: number): string {
  if (score >= 7 && score <= 9) return "Berat"
  if (score >= 4 && score <= 6) return "Ringan hingga Sedang"
  if (score >= 0 && score <= 3) return "Tidak ada gejala atau Ringan"
  return "Tidak Diketahui"
}

export async function submitPosttest(answers: number[], userData: any) {
  
  try {
    // const userSession = getUserSession()
    // if (!userSession) {
    //   return { success: false, error: "User not authenticated" }
    // }

    const supabase = createServerClient()

    // Calculate depression score (EPDS)
     const totalScore = answers.reduce((sum: number, score: number) => sum + score, 0);

    // Determine depression category based on EPDS scoring
    let depressionCategory = getDepressionCategory(totalScore);


    // Calculate anxiety score (questions 3, 4, 5 are anxiety-related in EPDS)
    const anxietyQuestions = [2, 3, 4] // 0-indexed (questions 3, 4, 5)
    const anxietyScore = anxietyQuestions.reduce((sum, index) => {
      return sum + (answers[index] || 0)
    }, 0)

    let anxietyCategory = getAnxietyCategory(anxietyScore);

  // const userData = JSON.parse(localStorage.getItem('userData') || '{}')
// Ambil flag login


// if (userLoggedIn && userDataString) {

//   console.log("User ID:", userData.id);
//   console.log("Nama:", userData.name);
//   console.log("Phone:", userData.phone);
// } else {
//   console.log("User belum login atau data tidak ditemukan");
// }
    const posttestData = {
      user_id:userData.id,
      user_name: userData.full_name,
      user_phone: userData.phone,
      answers: answers,
      total_depression_score: totalScore,
      depression_category: depressionCategory,
      total_anxiety_score: anxietyScore,
      anxiety_category: anxietyCategory,
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("posttest_results").insert(posttestData)

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error submitting posttest:", error)
    return { success: false, error: "Failed to submit posttest" }
  }
}

export async function getUserPosttestResults(userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("posttest_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching posttest results:", error)
    return { success: false, error: "Failed to fetch results", data: [] }
  }
}

export async function getAllPosttestResults() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("posttest_results")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching all posttest results:", error)
    return { success: false, error: "Failed to fetch results", data: [] }
  }
}
