// import { type NextRequest, NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"
// import webpush from "web-push"

// // Configure VAPID keys for web push
// const vapidKeys = {
//   publicKey: process.env.VAPID_PUBLIC_KEY || "BEl62iUYgUivxIkv69yViEuiBIa40HI80NqIUHI80NqIUHI80NqIUHI80NqIUHI80NqI",
//   privateKey: process.env.VAPID_PRIVATE_KEY || "your-private-vapid-key-here",
// }

// webpush.setVapidDetails("mailto:admin@lentera-bunda.com", vapidKeys.publicKey, vapidKeys.privateKey)

// export async function POST(request: NextRequest) {
//   try {
//     const { userId, title, message, type = "info" } = await request.json()

//     if (!userId || !title || !message) {
//       return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
//     }

//     const supabase = createServerClient()

//     // Get all active devices with push subscriptions for the user
//     const { data: devices, error: devicesError } = await supabase
//       .from("user_devices")
//       .select("*")
//       .eq("user_id", userId)
//       .eq("is_active", true)
//       .not("push_subscription", "is", null)

//     if (devicesError) {
//       console.error("Error fetching devices:", devicesError)
//       return NextResponse.json({ success: false, error: "Failed to fetch user devices" }, { status: 500 })
//     }

//     const deliveryResults: Record<string, string> = {}
//     let successCount = 0

//     // Send push notifications to all devices
//     if (devices && devices.length > 0) {
//       for (const device of devices) {
//         try {
//           const pushSubscription = JSON.parse(device.push_subscription)

//           const payload = JSON.stringify({
//             title,
//             body: message,
//             icon: "/icon-192x192.png",
//             badge: "/icon-192x192.png",
//             vibrate: [100, 50, 100],
//             tag: `notification-${Date.now()}`,
//             data: {
//               url: "/user/dashboard",
//               notificationId: `${Date.now()}`,
//               type,
//             },
//             actions: [
//               {
//                 action: "open",
//                 title: "Buka Aplikasi",
//                 icon: "/icon-192x192.png",
//               },
//               {
//                 action: "close",
//                 title: "Tutup",
//                 icon: "/icon-192x192.png",
//               },
//             ],
//           })

//           await webpush.sendNotification(pushSubscription, payload)
//           deliveryResults[device.id] = "delivered"
//           successCount++
//         } catch (error) {
//           console.error(`Failed to send push to device ${device.id}:`, error)
//           deliveryResults[device.id] = "failed"

//           // If subscription is invalid, remove it
//           if (error instanceof Error && error.message.includes("410")) {
//             await supabase.from("user_devices").update({ push_subscription: null }).eq("id", device.id)
//           }
//         }
//       }
//     }

//     // Store notification in database
//     const { error: notificationError } = await supabase.from("user_notifications").insert({
//       user_id: userId,
//       title,
//       message,
//       notification_type: type,
//       devices_sent_to: devices?.length || 0,
//       delivery_status: deliveryResults,
//       sent_at: new Date().toISOString(),
//       created_at: new Date().toISOString(),
//     })

//     if (notificationError) {
//       console.error("Error storing notification:", notificationError)
//       return NextResponse.json({ success: false, error: "Failed to store notification" }, { status: 500 })
//     }

//     return NextResponse.json({
//       success: true,
//       devicesCount: devices?.length || 0,
//       successCount,
//       deliveryResults,
//     })
//   } catch (error) {
//     console.error("Push notification error:", error)
//     return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import webpush from "web-push"

// Configure VAPID keys for web push
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || "BEl62iUYgUivxIkv69yViEuiBIa40HI80NqIUHI80NqIUHI80NqIUHI80NqIUHI80NqI",
  privateKey: process.env.VAPID_PRIVATE_KEY || "your-private-vapid-key-here",
}

webpush.setVapidDetails("mailto:admin@lentera-bunda.com", vapidKeys.publicKey, vapidKeys.privateKey)

export async function POST(request: NextRequest) {
  try {
    const { userId, title, message, type = "info" } = await request.json()

    if (!userId || !title || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get all active devices with push subscriptions for the user
    const { data: devices, error: devicesError } = await supabase
      .from("user_devices")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .not("push_subscription", "is", null)

    if (devicesError) {
      console.error("Error fetching devices:", devicesError)
      return NextResponse.json({ success: false, error: "Failed to fetch user devices" }, { status: 500 })
    }

    const deliveryResults: Record<string, string> = {}
    let successCount = 0

    // Send push notifications to all devices
    if (devices && devices.length > 0) {
      for (const device of devices) {
        try {
          const pushSubscription = JSON.parse(device.push_subscription)

          const payload = JSON.stringify({
            title,
            body: message,
            icon: "/icon-192x192.png",
            badge: "/icon-192x192.png",
            vibrate: [100, 50, 100],
            tag: `notification-${Date.now()}`,
            data: {
              url: "/user/dashboard",
              notificationId: `${Date.now()}`,
              type,
            },
            actions: [
              {
                action: "open",
                title: "Buka Aplikasi",
                icon: "/icon-192x192.png",
              },
              {
                action: "close",
                title: "Tutup",
                icon: "/icon-192x192.png",
              },
            ],
          })

          await webpush.sendNotification(pushSubscription, payload)
          deliveryResults[device.id] = "delivered"
          successCount++
        } catch (error) {
          console.error(`Failed to send push to device ${device.id}:`, error)
          deliveryResults[device.id] = "failed"

          // If subscription is invalid, remove it
          if (error instanceof Error && error.message.includes("410")) {
            await supabase.from("user_devices").update({ push_subscription: null }).eq("id", device.id)
          }
        }
      }
    }

    // Store notification in database
    const { error: notificationError } = await supabase.from("user_notifications").insert({
      user_id: userId,
      title,
      message,
      notification_type: type,
      devices_sent_to: devices?.length || 0,
      delivery_status: deliveryResults,
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })

    if (notificationError) {
      console.error("Error storing notification:", notificationError)
      return NextResponse.json({ success: false, error: "Failed to store notification" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      devicesCount: devices?.length || 0,
      successCount,
      deliveryResults,
    })
  } catch (error) {
    console.error("Push notification error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}