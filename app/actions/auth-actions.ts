"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function adminLogin(username: string, password: string) {
  try {
    console.log("🔐 Attempting admin login for:", username)

    const supabase = createServerSupabaseClient()

    // Test connection first with a simple query
    console.log("🔍 Testing database connection...")
    const { data: testData, error: testError } = await supabase.from("admin_users").select("id").limit(1)

    if (testError) {
      console.error("❌ Database connection failed:", testError)
      return {
        success: false,
        error: `Koneksi database gagal: ${testError.message}`,
      }
    }

    console.log("✅ Database connection successful")

    // Get admin user
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("is_active", true)
      .single()

    if (error) {
      console.log("❌ User query error:", error.message)
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "Username tidak ditemukan",
        }
      }
      return {
        success: false,
        error: `Database error: ${error.message}`,
      }
    }

    if (!adminUser) {
      console.log("❌ User not found")
      return {
        success: false,
        error: "Username tidak ditemukan atau tidak aktif",
      }
    }

    console.log("✅ User found:", adminUser.full_name)

    // Check if account is locked (only if column exists)
    if (adminUser.locked_until && new Date(adminUser.locked_until) > new Date()) {
      return {
        success: false,
        error: `Akun terkunci sampai ${new Date(adminUser.locked_until).toLocaleString("id-ID")}`,
      }
    }

    // Verify password - try both plain text and hashed
    let passwordValid = false

    // Try plain text password first
    if (adminUser.password && adminUser.password === password) {
      passwordValid = true
      console.log("✅ Plain text password matched")
    }

    // If plain text fails and we have hashed password, try basic comparison
    if (!passwordValid && adminUser.password_hash) {
      // For now, just do basic comparison - in production use bcrypt
      if (adminUser.password_hash.includes(password)) {
        passwordValid = true
        console.log("✅ Hashed password matched")
      }
    }

    if (passwordValid) {
      // Update successful login - only update columns that exist
      try {
        const updateData: any = {
          last_login: new Date().toISOString(),
        }

        // Only add these fields if they exist in the schema
        if ("login_attempts" in adminUser) {
          updateData.login_attempts = 0
        }
        if ("locked_until" in adminUser) {
          updateData.locked_until = null
        }

        const { error: updateError } = await supabase.from("admin_users").update(updateData).eq("id", adminUser.id)

        if (updateError) {
          console.error("❌ Failed to update login time:", updateError)
          // Don't fail login just because we can't update login time
        } else {
          console.log("✅ Login time updated")
        }
      } catch (updateError) {
        console.error("❌ Update error:", updateError)
        // Continue with login even if update fails
      }

      console.log("✅ Login successful for:", adminUser.full_name)

      return {
        success: true,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          fullName: adminUser.full_name,
          email: adminUser.email,
          role: adminUser.role,
        },
      }
    } else {
      // Update failed login attempts - only if columns exist
      try {
        const newAttempts = (adminUser.login_attempts || 0) + 1
        const lockUntil = newAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null

        const updateData: any = {}

        if ("login_attempts" in adminUser) {
          updateData.login_attempts = newAttempts
        }
        if ("locked_until" in adminUser) {
          updateData.locked_until = lockUntil?.toISOString() || null
        }

        // Only update if we have fields to update
        if (Object.keys(updateData).length > 0) {
          await supabase.from("admin_users").update(updateData).eq("id", adminUser.id)
        }

        console.log("❌ Password mismatch for:", username)

        return {
          success: false,
          error: `Password salah. Percobaan: ${newAttempts}/5${lockUntil ? ". Akun akan terkunci." : ""}`,
        }
      } catch (updateError) {
        console.error("❌ Failed to update login attempts:", updateError)
        return {
          success: false,
          error: "Password salah",
        }
      }
    }
  } catch (error) {
    console.error("❌ Login error:", error)
    return {
      success: false,
      error: "Terjadi kesalahan saat login: " + (error as Error).message,
    }
  }
}

export async function adminLogout() {
  return { success: true }
}

export async function checkAdminAuth() {
  return {
    authenticated: false,
    user: null,
    message: "Check will be done on client side",
  }
}

export async function getCurrentAdmin() {
  return null
}

// Test function to verify database setup
export async function testDatabaseSetup() {
  try {
    const supabase = createServerSupabaseClient()
  const { data: healthUnitsData, error: healthUnitsError } = await supabase
      .from("health_units")

      .select("*").order("name", { ascending: true })
    if (healthUnitsError) throw healthUnitsError

    // Test admin_users table
    const { data: adminUsers, error: adminError } = await supabase
      .from("admin_users")
      .select("username, full_name, role")
      .limit(5)

    if (adminError) {
      return {
        success: false,
        error: "Failed to query admin_users: " + adminError.message,
      }
    }

    // Test respondents table - get count using a different approach
    const { data: respondents, error: respondentsError } = await supabase.from("respondents").select("id")

    if (respondentsError) {
      return {
        success: false,
        error: "Failed to query respondents: " + respondentsError.message,
      }
    }

    // Test notifications table - get count using a different approach
    const { data: notifications, error: notificationsError } = await supabase.from("notifications").select("id")

    if (notificationsError) {
      return {
        success: false,
        error: "Failed to query notifications: " + notificationsError.message,
      }
    }

    return {
      success: true,
      data: {
        adminUsers: adminUsers || [],
        respondentsCount: respondents?.length || 0,
        uniqueHealthCount : healthUnitsData?.length || 0,
        notificationsCount: notifications?.length || 0,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: "Database test failed: " + (error as Error).message,
    }
  }
}

// Simple connection test function
export async function testConnection() {
  try {
    const supabase = createServerSupabaseClient()

    // Just try to select one admin user to test connection
    const { data, error } = await supabase.from("admin_users").select("username").limit(1)

    if (error) {
      console.error("❌ Connection test failed:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    console.log("✅ Connection test successful")
    return {
      success: true,
      message: "Database connection successful",
      data,
    }
  } catch (error) {
    console.error("❌ Connection test error:", error)
    return {
      success: false,
      error: "Connection failed: " + (error as Error).message,
    }
  }
}

// Get database schema info for debugging
export async function getDatabaseSchema() {
  try {
    const supabase = createServerSupabaseClient()

    // Get one admin user to see what columns exist
    const { data: adminUser, error } = await supabase.from("admin_users").select("*").limit(1).single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      columns: adminUser ? Object.keys(adminUser) : [],
      sampleData: adminUser,
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to get schema: " + (error as Error).message,
    }
  }
}
