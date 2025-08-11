import { createServerSupabaseClient } from "./supabase"

export interface AdminUser {
  id: string
  username: string
  full_name: string
  email: string
  role: string
  permissions?: any
  is_active: boolean
  last_login?: string
  password_type?: "plain" | "hashed" | "both" | "none"
}

export interface AuthResult {
  success: boolean
  user?: AdminUser
  error?: string
  session_token?: string
}

// Simple hash function for development (use bcrypt in production)
function simpleHash(password: string): string {
  // This is a simple hash for development - use bcrypt in production
  return `$2b$10$${Buffer.from(password).toString("base64").slice(0, 50)}`
}

export async function verifyAdminCredentials(
  username: string,
  password: string,
  useHashedPassword = false,
): Promise<AuthResult> {
  try {
    const supabase = createServerSupabaseClient()

    // Get admin user first
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("is_active", true)
      .single()

    if (error || !adminUser) {
      return {
        success: false,
        error: "Username tidak ditemukan atau tidak aktif",
      }
    }

    // Check if account is locked
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
    }

    // If plain text fails and we have hashed password, try that
    if (!passwordValid && adminUser.password_hash && useHashedPassword) {
      const hashedInput = simpleHash(password)
      if (adminUser.password_hash === hashedInput) {
        passwordValid = true
      }
    }

    if (passwordValid) {
      // Update successful login
      await supabase
        .from("admin_users")
        .update({
          last_login: new Date().toISOString(),
          login_attempts: 0,
          locked_until: null,
        })
        .eq("id", adminUser.id)

      // Get user permissions
      const { data: roleData } = await supabase
        .from("admin_roles")
        .select("permissions")
        .eq("role_name", adminUser.role)
        .single()

      const user: AdminUser = {
        id: adminUser.id,
        username: adminUser.username,
        full_name: adminUser.full_name,
        email: adminUser.email,
        role: adminUser.role,
        permissions: roleData?.permissions || {},
        is_active: true,
      }

      return {
        success: true,
        user,
      }
    } else {
      // Update failed login attempts
      const newAttempts = (adminUser.login_attempts || 0) + 1
      const lockUntil = newAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null // 30 minutes

      await supabase
        .from("admin_users")
        .update({
          login_attempts: newAttempts,
          locked_until: lockUntil?.toISOString() || null,
        })
        .eq("id", adminUser.id)

      return {
        success: false,
        error: `Password salah. Percobaan: ${newAttempts}/5${lockUntil ? ". Akun akan terkunci." : ""}`,
      }
    }
  } catch (error) {
    console.error("Error verifying admin credentials:", error)
    return {
      success: false,
      error: "Terjadi kesalahan sistem autentikasi",
    }
  }
}

export async function createAdminSession(
  adminId: string,
  ipAddress?: string,
  userAgent?: string,
): Promise<string | null> {
  try {
    const supabase = createServerSupabaseClient()

    // Generate session token
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Use the database function to create session
    const { data, error } = await supabase.rpc("create_admin_session", {
      p_admin_id: adminId,
      p_session_token: sessionToken,
      p_expires_at: expiresAt.toISOString(),
      p_ip_address: ipAddress || null,
      p_user_agent: userAgent || null,
    })

    if (error) {
      console.error("Error creating admin session:", error)
      return null
    }

    return sessionToken
  } catch (error) {
    console.error("Error creating admin session:", error)
    return null
  }
}

export async function verifyAdminSession(sessionToken: string): Promise<AdminUser | null> {
  try {
    const supabase = createServerSupabaseClient()

    // Use the database function to verify session
    const { data, error } = await supabase.rpc("verify_admin_session", {
      p_session_token: sessionToken,
    })

    if (error || !data || data.length === 0) {
      return null
    }

    const result = data[0]

    if (!result.is_valid) {
      return null
    }

    return {
      id: result.user_id,
      username: result.username,
      full_name: result.full_name,
      email: result.email,
      role: result.role,
      permissions: result.permissions || {},
      is_active: true,
    }
  } catch (error) {
    console.error("Error verifying admin session:", error)
    return null
  }
}

export async function deleteAdminSession(sessionToken: string): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from("admin_sessions")
      .update({ is_active: false })
      .eq("session_token", sessionToken)

    return !error
  } catch (error) {
    console.error("Error deleting admin session:", error)
    return false
  }
}

export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const supabase = createServerSupabaseClient()

    const { data } = await supabase.rpc("cleanup_admin_sessions")

    return data || 0
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error)
    return 0
  }
}

export async function getAdminLoginLogs(adminId?: string, limit = 50) {
  try {
    const supabase = createServerSupabaseClient()

    let query = supabase
      .from("admin_login_logs")
      .select(`
        *,
        admin_users(username, full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (adminId) {
      query = query.eq("admin_id", adminId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching login logs:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching login logs:", error)
    return []
  }
}

export async function getAllAdminUsers() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("admin_user_summary")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching admin users:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching admin users:", error)
    return []
  }
}

function generateSessionToken(): string {
  return "admin_" + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Utility function to check permissions
export function hasPermission(user: AdminUser, resource: string, action: string): boolean {
  if (!user.permissions || !user.permissions[resource]) {
    return false
  }

  return user.permissions[resource][action] === true
}

// Utility function to check if user is admin
export function isAdmin(user: AdminUser): boolean {
  return user.role === "admin"
}

// Utility function to check if user is researcher
export function isResearcher(user: AdminUser): boolean {
  return user.role === "researcher" || user.role === "admin"
}
