import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export function createServerClient() {
  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      getSession: async () => {
        const sessionCookie = cookieStore.get("sb-session")
        if (sessionCookie) {
          try {
            return { data: { session: JSON.parse(sessionCookie.value) }, error: null }
          } catch {
            return { data: { session: null }, error: null }
          }
        }
        return { data: { session: null }, error: null }
      },
      setSession: async (session) => {
        if (session) {
          cookieStore.set("sb-session", JSON.stringify(session), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          })
        } else {
          cookieStore.delete("sb-session")
        }
      },
    },
  })
}
