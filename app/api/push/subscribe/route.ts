// import { type NextRequest, NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"

// export async function POST(request: NextRequest) {
//   try {
//     const { userId, subscription, deviceInfo } = await request.json()

//     if (!userId || !subscription) {
//       return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
//     }

//     const supabase = createServerClient()

//     const deviceData = {
//       user_id: userId,
//       device_token: subscription.endpoint,
//       device_type: deviceInfo?.deviceType || "web",
//       device_name: deviceInfo?.deviceName || "Unknown Device",
//       browser_info: deviceInfo?.browserInfo || "",
//       push_subscription: JSON.stringify(subscription),
//       is_active: true,
//       last_used_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     }

//     // Use upsert to handle existing subscriptions
//     const { error } = await supabase.from("user_devices").upsert(deviceData, {
//       onConflict: "user_id,device_token",
//     })

//     if (error) {
//       console.error("Error saving subscription:", error)
//       return NextResponse.json({ success: false, error: "Failed to save subscription" }, { status: 500 })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Subscription error:", error)
//     return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, subscription, deviceInfo } = await request.json()

    if (!userId || !subscription) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    const deviceData = {
      user_id: userId,
      device_token: subscription.endpoint,
      device_type: deviceInfo?.deviceType || "web",
      device_name: deviceInfo?.deviceName || "Unknown Device",
      browser_info: deviceInfo?.browserInfo || "",
      push_subscription: JSON.stringify(subscription),
      is_active: true,
      last_used_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Use upsert to handle existing subscriptions
    const { error } = await supabase.from("user_devices").upsert(deviceData, {
      onConflict: "user_id,device_token",
    })

    if (error) {
      console.error("Error saving subscription:", error)
      return NextResponse.json({ success: false, error: "Failed to save subscription" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}