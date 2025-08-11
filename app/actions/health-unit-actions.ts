"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getAllHealthUnits() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("health_units").select("*").order("name", { ascending: true })

    if (error) throw error

    // Ensure respondent_count is always a number
    const processedData = (data || []).map((unit) => ({
      ...unit,
      respondent_count: unit.respondent_count || 0,
    }))

    return { success: true, data: processedData }
  } catch (error) {
    console.error("Error fetching health units:", error)
    return { success: false, error: "Failed to fetch health units", data: [] }
  }
}

export async function createHealthUnit(formData: any) {
  try {
    const supabase = createServerSupabaseClient()

    const healthUnitData = {
      name: formData.name,
      type: formData.type,
      is_active: formData.is_active ?? true,
    }

    const { error } = await supabase.from("health_units").insert(healthUnitData)

    if (error) throw error

    revalidatePath("/admin/health-units")
    return { success: true }
  } catch (error) {
    console.error("Error creating health unit:", error)
    return { success: false, error: "Failed to create health unit" }
  }
}

export async function updateHealthUnit(id: string, formData: any) {
  try {
    const supabase = createServerSupabaseClient()

    const updateData = {
      name: formData.name,
      type: formData.type,
      is_active: formData.is_active,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("health_units").update(updateData).eq("id", id)

    if (error) throw error

    revalidatePath("/admin/health-units")
    return { success: true }
  } catch (error) {
    console.error("Error updating health unit:", error)
    return { success: false, error: "Failed to update health unit" }
  }
}

export async function deleteHealthUnit(id: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Check if health unit has respondents
    const { data: respondents, error: checkError } = await supabase
      .from("respondents")
      .select("id")
      .eq("nama_puskesmas", (await supabase.from("health_units").select("name").eq("id", id).single()).data?.name)
      .limit(1)

    if (checkError) throw checkError

    if (respondents && respondents.length > 0) {
      return { success: false, error: "Tidak dapat menghapus unit kesehatan yang memiliki responden" }
    }

    const { error } = await supabase.from("health_units").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/health-units")
    return { success: true }
  } catch (error) {
    console.error("Error deleting health unit:", error)
    return { success: false, error: "Failed to delete health unit" }
  }
}

export async function getHealthUnitById(id: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("health_units").select("*").eq("id", id).single()

    if (error) throw error

    // Ensure respondent_count is always a number
    const processedData = {
      ...data,
      respondent_count: data.respondent_count || 0,
    }

    return { success: true, data: processedData }
  } catch (error) {
    console.error("Error fetching health unit:", error)
    return { success: false, error: "Failed to fetch health unit" }
  }
}
