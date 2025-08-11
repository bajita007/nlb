"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// CREATE - Add new respondent
export async function createRespondent(formData: any) {
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

    // Calculate score and category
    const totalScore = formData.kuesioner.reduce((sum: number, score: number) => sum + score, 0)
    let category = "Sangat Ringan"
    if (totalScore > 20) category = "Berat"
    else if (totalScore >= 13) category = "Sedang-Berat"
    else if (totalScore >= 10) category = "Ringan-Sedang"
    else if (totalScore >= 0) category = "Sangat Ringan"

    const respondentData = {
      respondent_number: respNumber,
      user_id: formData.userId || "admin_" + crypto.randomUUID(),
      device_id: formData.deviceId || "admin_device",
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
      nama_anggota_keluarga: formData.namaAnggotaKeluarga,
      riwayat_masalah_kesehatan: formData.riwayatMasalahKesehatan,
      masalah_kehamilan: formData.masalahKehamilan,
      kuesioner: formData.kuesioner,
      total_score: totalScore,
      category: category,
      submitted_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("respondents").insert(respondentData)

    if (error) throw error

    revalidatePath("/admin/dashboard")
    return { success: true, data: respondentData }
  } catch (error) {
    console.error("Error creating respondent:", error)
    return { success: false, error: "Failed to create respondent" }
  }
}

// UPDATE - Edit existing respondent
export async function updateRespondent(id: string, formData: any) {
  try {
    const supabase = createServerSupabaseClient()

    // Calculate score and category
    const totalScore = formData.kuesioner.reduce((sum: number, score: number) => sum + score, 0)
    let category = "Sangat Ringan"
    if (totalScore > 20) category = "Berat"
    else if (totalScore >= 13) category = "Sedang-Berat"
    else if (totalScore >= 10) category = "Ringan-Sedang"
    else if (totalScore >= 0) category = "Sangat Ringan"

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
      nama_anggota_keluarga: formData.namaAnggotaKeluarga,
      riwayat_masalah_kesehatan: formData.riwayatMasalahKesehatan,
      masalah_kehamilan: formData.masalahKehamilan,
      kuesioner: formData.kuesioner,
      total_score: totalScore,
      category: category,
    }

    const { error } = await supabase.from("respondents").update(updateData).eq("id", id)

    if (error) throw error

    revalidatePath("/admin/dashboard")
    revalidatePath(`/admin/respondent/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating respondent:", error)
    return { success: false, error: "Failed to update respondent" }
  }
}

// DELETE - Remove respondent
export async function deleteRespondent(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("respondents").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting respondent:", error)
    return { success: false, error: "Failed to delete respondent" }
  }
}

// GET - Get respondent by ID
export async function getRespondentByIdForEdit(id: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("respondents").select("*").eq("id", id).single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching respondent:", error)
    return { success: false, error: "Failed to fetch respondent" }
  }
}

// BULK DELETE - Delete multiple respondents
export async function bulkDeleteRespondents(ids: string[]) {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("respondents").delete().in("id", ids)

    if (error) throw error

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error bulk deleting respondents:", error)
    return { success: false, error: "Failed to delete respondents" }
  }
}

// EXPORT - Get all data for Excel export
export async function getExportData() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("respondents").select("*").order("submitted_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching export data:", error)
    return { success: false, error: "Failed to fetch export data", data: [] }
  }
}

// NEW: Get dashboard statistics
export async function getDashboardStats() {
  try {
    const supabase = createServerSupabaseClient()

    // Total respondents
    const { count: totalRespondents, error: totalError } = await supabase
      .from("respondents")
      .select("*", { count: "exact", head: true })
    if (totalError) throw totalError

    // High-risk respondents (total_score >= 13)
    const { count: highRiskRespondents, error: highRiskError } = await supabase
      .from("respondents")
      .select("*", { count: "exact", head: true })
      .gte("total_score", 13)
    if (highRiskError) throw highRiskError

    // Unique health units count
    const { data: healthUnitsData, error: healthUnitsError } = await supabase
      .from("health_units")

      .select("*").order("name", { ascending: true })
    if (healthUnitsError) throw healthUnitsError
    const uniqueHealthUnits = new Set(healthUnitsData?.map((d) => d.nama_puskesmas)).size

    // Respondents submitted today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const { count: todayRespondents, error: todayError } = await supabase
      .from("respondents")
      .select("*", { count: "exact", head: true })
      .gte("submitted_at", today.toISOString())
      .lt("submitted_at", tomorrow.toISOString())
    if (todayError) throw todayError

    return {
      success: true,
      data: {
        totalRespondents,
        highRiskRespondents,
        uniqueHealthUnits,
        todayRespondents,
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return { success: false, error: "Failed to fetch dashboard stats", data: null }
  }
}

// NEW: Get devices with respondent counts
export async function getDevicesWithRespondents() {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch all respondents to group by device_id
    const { data: respondents, error } = await supabase
      .from("respondents")
      .select("id, respondent_number, nama, nomor_telepon, device_id") // Include 'id' (UUID) and 'respondent_number'
      .order("created_at", { ascending: false }) // Order to get latest user for a device_id

    if (error) throw error

    const deviceMap = new Map<
      string,
      {
        device_id: string
        user_name: string
        phone_number: string
        respondent_count: number
        respondents: { id: string; nama: string; respondent_number: string }[] // 'id' is now the UUID
      }
    >()

    respondents?.forEach((r) => {
      if (!deviceMap.has(r.device_id)) {
        deviceMap.set(r.device_id, {
          device_id: r.device_id,
          user_name: r.nama, // First respondent's name for display
          phone_number: r.nomor_telepon, // First respondent's phone for display
          respondent_count: 0,
          respondents: [],
        })
      }
      const deviceEntry = deviceMap.get(r.device_id)!
      deviceEntry.respondent_count += 1
      deviceEntry.respondents.push({
        id: r.id, // This is the actual UUID for the detail link
        nama: r.nama,
        respondent_number: r.respondent_number, // This is the R001 format
      })
    })

    const devices = Array.from(deviceMap.values())

    return { success: true, data: devices }
  } catch (error) {
    console.error("Error fetching devices with respondents:", error)
    return { success: false, error: "Failed to fetch device data", data: [] }
  }
}
