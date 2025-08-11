"use server"

import { verifyAdminCredentials, createAdminSession, deleteAdminSession } from "@/lib/auth-enhanced"

export async function adminLogin(username: string, password: string) {
  try {
    console.log("🔐 Attempting enhanced admin login for:", username)

    // Try with plain text password first
    let result = await verifyAdminCredentials(username, password, false)

    // If plain text fails, try with hashed password
    if (!result.success) {
      result = await verifyAdminCredentials(username, password, true)
    }

    if (result.success && result.user) {
      // Create session token
      const sessionToken = await createAdminSession(result.user.id)

      console.log("✅ Enhanced login successful for:", result.user.full_name)

      return {
        success: true,
        user: {
          id: result.user.id,
          username: result.user.username,
          fullName: result.user.full_name,
          email: result.user.email,
          role: result.user.role,
          permissions: result.user.permissions,
        },
        sessionToken,
      }
    } else {
      console.log("❌ Enhanced login failed:", result.error)
      return {
        success: false,
        error: result.error || "Username atau password salah",
      }
    }
  } catch (error) {
    console.error("Enhanced login error:", error)
    return {
      success: false,
      error: "Terjadi kesalahan saat login",
    }
  }
}

export async function adminLogout(sessionToken?: string) {
  try {
    if (sessionToken) {
      await deleteAdminSession(sessionToken)
    }
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Terjadi kesalahan saat logout" }
  }
}

export async function checkAdminAuth() {
  // This will be handled on client side with localStorage
  return {
    authenticated: false,
    user: null,
    message: "Check will be done on client side with enhanced auth",
  }
}

export async function getCurrentAdmin() {
  return null
}

// New function to get admin statistics
export async function getAdminStats() {
  try {
    // This would typically fetch from database
    return {
      totalAdmins: 2,
      activeAdmins: 2,
      totalSessions: 0,
      activeSessions: 0,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      totalAdmins: 0,
      activeAdmins: 0,
      totalSessions: 0,
      activeSessions: 0,
    }
  }
}
