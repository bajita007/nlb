"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Types for better type safety
interface RespondentData {
  id: string
  respondent_number: string
  user_id: string
  device_id: string
  nama: string
  tanggal_lahir: string
  alamat: string
  nomor_telepon: string
  nama_puskesmas: string
  berat_badan: string
  tinggi_badan: string
  lila: string
  pendidikan: string
  pekerjaan: string
  status_pernikahan: string
  pekerjaan_suami: string
  pendidikan_suami: string
  riwayat_antidepresan: string
  riwayat_keluarga_antidepresan: string
  dukungan_suami: string
  dukungan_keluarga: string
  nama_anggota_keluarga: string | null
  riwayat_masalah_kesehatan: string | null
  masalah_kehamilan: string[]
  kuesioner: number[]
  total_depression_score: number
  depression_category: string
  total_anxiety_score: number
  anxiety_category: string
  submitted_at: string
  created_at: string
}

// Helper function to calculate depression category
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

export async function submitRespondentData(formData: any) {
  try {
    const supabase = createServerSupabaseClient()

    // Generate respondent number
    const { data: existingData } = await supabase
      .from("respondents")
      .select("respondent_number")
      .order("created_at", { ascending: false })
      .limit(1)

    let respNumber = "R001"
    if (existingData && existingData.length > 0) {
      const lastNumber = Number.parseInt(existingData[0].respondent_number.substring(1))
      respNumber = `R${String(lastNumber + 1).padStart(3, "0")}`
    }

    // Calculate depression score and category (all 10 questions)
    const totalDepressionScore = formData.kuesioner.reduce((sum: number, score: number) => sum + score, 0)
    const depressionCategory = getDepressionCategory(totalDepressionScore)

    // Calculate anxiety score and category (questions 3, 4, 5 - 0-indexed: 2, 3, 4)
    const anxietyQuestionsScores = [
      formData.kuesioner[2], // Question 3
      formData.kuesioner[3], // Question 4
      formData.kuesioner[4], // Question 5
    ]
    const totalAnxietyScore = anxietyQuestionsScores.reduce((sum: number, score: number) => sum + score, 0)
    const anxietyCategory = getAnxietyCategory(totalAnxietyScore)

    // Prepare data sesuai struktur tabel respondents yang ada
    const respondentData = {
      respondent_number: respNumber,
      user_id: formData.userId,
      device_id: formData.deviceId,
      nama: formData.nama,
      tanggal_lahir: formData.tanggalLahir,
      alamat: formData.alamat,
      nomor_telepon: formData.nomorTelepon,
      nama_puskesmas: formData.namaPuskesmas,
      berat_badan: formData.beratBadan,
      tinggi_badan: formData.tinggiBadan,
      lila: formData.lila,
      pendidikan: formData.pendidikan,
      pekerjaan: formData.pekerjaan,
      status_pernikahan: formData.statusPernikahan,
      pekerjaan_suami: formData.pekerjaanSuami,
      pendidikan_suami: formData.pendidikanSuami,
      riwayat_antidepresan: formData.riwayatAntidepresan,
      riwayat_keluarga_antidepresan: formData.riwayatKeluargaAntidepresan,
      dukungan_suami: formData.dukunganSuami,
      dukungan_keluarga: formData.dukunganKeluarga,
      nama_anggota_keluarga: formData.namaAnggotaKeluarga || null,
      riwayat_masalah_kesehatan: formData.riwayatMasalahKesehatan || null,
      masalah_kehamilan: formData.masalahKehamilan || [],
      kuesioner: formData.kuesioner,
      total_depression_score: totalDepressionScore,
      depression_category: depressionCategory,
      total_anxiety_score: totalAnxietyScore,
      anxiety_category: anxietyCategory,
      submitted_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("respondents").insert(respondentData)

    if (error) throw error

    revalidatePath("/admin/dashboard")
    return {
      success: true,
      data: { ...respondentData, respondentNumber: respNumber, riskCategory: depressionCategory },
    }
  } catch (error) {
    console.error("Error submitting respondent data:", error)
    return { success: false, error: "Failed to submit data" }
  }
}

export async function getAllRespondents() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("respondents").select("*").order("submitted_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data as RespondentData[] }
  } catch (error) {
    console.error("Error fetching all respondents:", error)
    return { success: false, error: "Failed to fetch data", data: [] }
  }
}

export async function getRespondentById(id: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("respondents").select("*").eq("id", id).single()

    if (error) throw error

    return { success: true, data: data as RespondentData }
  } catch (error) {
    console.error("Error fetching respondent by ID:", error)
    return { success: false, error: "Failed to fetch data", data: null }
  }
}

export async function getRespondentsByPhone(phone: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("respondents")
      .select(`
      id,
      respondent_number,
      nama,
      tanggal_lahir,
      nomor_telepon,
      nama_puskesmas,
      total_depression_score,
      depression_category,
      total_anxiety_score,
      anxiety_category,
      submitted_at,
      alamat
    `)
      .eq("nomor_telepon", phone)
      .order("submitted_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching respondents by phone:", error)
    return { success: false, error: "Failed to fetch data", data: [] }
  }
}

export async function getRespondentsByHealthUnit(healthUnit: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("respondents")
      .select("*")
      .eq("nama_puskesmas", healthUnit)
      .order("submitted_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data as RespondentData[] }
  } catch (error) {
    console.error("Error fetching respondents by health unit:", error)
    return { success: false, error: "Failed to fetch data", data: [] }
  }
}

export async function getRespondentsByCategory(category: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("respondents")
      .select("*")
      .eq("depression_category", category) // Assuming this is for depression category
      .order("submitted_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data as RespondentData[] }
  } catch (error) {
    console.error("Error fetching respondents by category:", error)
    return { success: false, error: "Failed to fetch data", data: [] }
  }
}

export async function updateRespondent(id: string, formData: any) {
  try {
    const supabase = createServerSupabaseClient()

    // Calculate depression score and category (all 10 questions)
    const totalDepressionScore = formData.kuesioner.reduce((sum: number, score: number) => sum + score, 0)
    const depressionCategory = getDepressionCategory(totalDepressionScore)

    // Calculate anxiety score and category (questions 3, 4, 5 - 0-indexed: 2, 3, 4)
    const anxietyQuestionsScores = [
      formData.kuesioner[2], // Question 3
      formData.kuesioner[3], // Question 4
      formData.kuesioner[4], // Question 5
    ]
    const totalAnxietyScore = anxietyQuestionsScores.reduce((sum: number, score: number) => sum + score, 0)
    const anxietyCategory = getAnxietyCategory(totalAnxietyScore)

    const updateData = {
      nama: formData.nama,
      tanggal_lahir: formData.tanggalLahir,
      alamat: formData.alamat,
      nomor_telepon: formData.nomorTelepon,
      nama_puskesmas: formData.namaPuskesmas,
      berat_badan: formData.beratBadan,
      tinggi_badan: formData.tinggiBadan,
      lila: formData.lila,
      pendidikan: formData.pendidikan,
      pekerjaan: formData.pekerjaan,
      status_pernikahan: formData.statusPernikahan,
      pekerjaan_suami: formData.pekerjaanSuami,
      pendidikan_suami: formData.pendidikanSuami,
      riwayat_antidepresan: formData.riwayatAntidepresan,
      riwayat_keluarga_antidepresan: formData.riwayatKeluargaAntidepresan,
      dukungan_suami: formData.dukunganSuami,
      dukungan_keluarga: formData.dukunganKeluarga,
      nama_anggota_keluarga: formData.namaAnggotaKeluarga || null,
      riwayat_masalah_kesehatan: formData.riwayatMasalahKesehatan || null,
      masalah_kehamilan: formData.masalahKehamilan || [],
      kuesioner: formData.kuesioner,
      total_depression_score: totalDepressionScore,
      depression_category: depressionCategory,
      total_anxiety_score: totalAnxietyScore,
      anxiety_category: anxietyCategory,
    }

    const { error } = await supabase.from("respondents").update(updateData).eq("id", id)

    if (error) throw error

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/respondents")
    return { success: true }
  } catch (error) {
    console.error("Error updating respondent:", error)
    return { success: false, error: "Failed to update data" }
  }
}

export async function deleteRespondent(id: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from("respondents").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/respondents")
    return { success: true }
  } catch (error) {
    console.error("Error deleting respondent:", error)
    return { success: false, error: "Failed to delete data" }
  }
}
