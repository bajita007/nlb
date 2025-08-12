import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, endpoint } = await request.json()

    if (!userId || !endpoint) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Remove push subscription from device
    const { error } = await supabase
      .from("user_devices")
      .update({
        push_subscription: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("device_token", endpoint)

    if (error) {
      console.error("Error removing subscription:", error)
      return NextResponse.json({ success: false, error: "Failed to remove subscription" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
