import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Create a single supabase client for client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a server-side client for server actions
export const createServerSupabaseClient = () => {
  if (!supabaseServiceKey) {
    console.warn("Missing SUPABASE_SERVICE_ROLE_KEY, using anon key")
    return createClient(supabaseUrl, supabaseAnonKey)
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    const supabase = createServerSupabaseClient()

    // Simple test - just select one row to verify connection
    const { data, error } = await supabase.from("admin_users").select("id").limit(1)

    if (error) {
      console.error("❌ Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Supabase connection test successful")
    return { success: true, data }
  } catch (error) {
    console.error("❌ Supabase connection test error:", error)
    return { success: false, error: "Connection failed" }
  }
}
