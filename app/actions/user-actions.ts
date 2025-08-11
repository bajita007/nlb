"use server"

import { createServerClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export interface AppUser {
  id: string
  email: string
  full_name: string
  phone_number: string | null
  is_active: boolean
  created_at: string
  last_login: string | null
}

export async function getAllAppUsers() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("app_users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching app users:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as AppUser[] }
  } catch (error) {
    console.error("Error in getAllAppUsers:", error)
    return { success: false, error: "Terjadi kesalahan saat mengambil data pengguna" }
  }
}

export async function createAppUser(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const phoneNumber = formData.get("phoneNumber") as string

    if (!email || !password || !fullName) {
      return { success: false, error: "Email, password, dan nama lengkap harus diisi" }
    }

    if (password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter" }
    }

    const supabase = createServerClient()

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("app_users")
      .select("id")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing user:", checkError)
      return { success: false, error: "Terjadi kesalahan saat memeriksa email" }
    }

    if (existingUser) {
      return { success: false, error: "Email sudah terdaftar" }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert new user
    const { data, error } = await supabase
      .from("app_users")
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        phone_number: phoneNumber || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating app user:", error)
      return { success: false, error: `Database error: ${error.message}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in createAppUser:", error)
    return { success: false, error: `Terjadi kesalahan: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

export async function updateAppUser(userId: string, formData: FormData) {
  try {
    const email = formData.get("email") as string
    const fullName = formData.get("fullName") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const isActive = formData.get("isActive") === "true"

    if (!email || !fullName) {
      return { success: false, error: "Email dan nama lengkap harus diisi" }
    }

    const supabase = createServerClient()

    const updateData: any = {
      email,
      full_name: fullName,
      phone_number: phoneNumber || null,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    }

    // If password is provided, hash it
    const password = formData.get("password") as string
    if (password && password.trim()) {
      if (password.length < 6) {
        return { success: false, error: "Password minimal 6 karakter" }
      }
      updateData.password_hash = await bcrypt.hash(password, 10)
    }

    const { data, error } = await supabase.from("app_users").update(updateData).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating app user:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in updateAppUser:", error)
    return { success: false, error: "Terjadi kesalahan saat mengupdate pengguna" }
  }
}

export async function deleteAppUser(userId: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("app_users").delete().eq("id", userId)

    if (error) {
      console.error("Error deleting app user:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteAppUser:", error)
    return { success: false, error: "Terjadi kesalahan saat menghapus pengguna" }
  }
}

export async function authenticateAppUser(email: string, password: string) {
  try {
    const supabase = createServerClient()

    const { data: user, error } = await supabase
      .from("app_users")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      return { success: false, error: "Email atau password salah" }
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: "Email atau password salah" }
    }

    // Update last login
    await supabase.from("app_users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    return { success: true, user: { ...user, password_hash: undefined } }
  } catch (error) {
    console.error("Error in authenticateAppUser:", error)
    return { success: false, error: "Terjadi kesalahan saat login" }
  }
}

export async function updateUserProfile(userId: string, profileData: { name: string; phone: string; email: string }) {
  try {
    const supabase = createServerClient()

    const updateData = {
      full_name: profileData.name,
      phone_number: profileData.phone,
      email: profileData.email,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("app_users").update(updateData).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating user profile:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    return { success: false, error: "Terjadi kesalahan saat mengupdate profil" }
  }
}
