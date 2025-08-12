"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function sendNotification(data: {
  recipientId: string
  recipientName: string
  recipientPhone: string
  deviceId: string
  message: string
}) {
  try {
    const supabase = createServerClient()

    const notificationData = {
      recipient_id: data.recipientId,
      recipient_name: data.recipientName,
      recipient_phone: data.recipientPhone,
      device_id: data.deviceId,
      message: data.message,
      sent_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("notifications").insert(notificationData)

    if (error) throw error

    revalidatePath("/admin/notifications")
    return { success: true }
  } catch (error) {
    console.error("Error sending notification:", error)
    return { success: false, error: "Failed to send notification" }
  }
}

export async function sendNotificationToAppUser(data: {
  userId: string
  title: string
  message: string
  sentBy?: string
}) {
  try {
    const supabase = createServerClient()

    // Get all active devices for the user
    const { data: userDevices, error: devicesError } = await supabase
      .from("user_devices")
      .select("*")
      .eq("user_id", data.userId)
      .eq("is_active", true)

    if (devicesError) {
      console.error("Error fetching user devices:", devicesError)
    }

    const deviceCount = userDevices?.length || 0
    const deliveryStatus: Record<string, string> = {}

    if (userDevices && userDevices.length > 0) {
      for (const device of userDevices) {
        try {
          // Send actual push notification if device has push subscription
          if (device.push_subscription) {
            const pushSubscription = JSON.parse(device.push_subscription)
            await sendWebPushNotification(pushSubscription, {
              title: data.title,
              body: data.message,
              icon: "/icon-192x192.png",
              badge: "/icon-192x192.png",
              tag: `notification-${Date.now()}`,
              data: {
                url: "/user/dashboard",
                notificationId: `${Date.now()}`,
              },
            })
            deliveryStatus[device.id] = "sent"
          } else {
            deliveryStatus[device.id] = "no_subscription"
          }
        } catch (error) {
          console.error(`Failed to send to device ${device.id}:`, error)
          deliveryStatus[device.id] = "failed"
        }
      }
    }

    const notificationData = {
      user_id: data.userId,
      title: data.title,
      message: data.message,
      sent_by: null,
      devices_sent_to: deviceCount,
      delivery_status: deliveryStatus,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("user_notifications").insert(notificationData)

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    revalidatePath("/admin/notifications")
    return { success: true, deviceCount }
  } catch (error) {
    console.error("Error sending notification to app user:", error)
    return {
      success: false,
      error: `Failed to send notification: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

async function sendWebPushNotification(subscription: any, payload: any) {
  // In a real implementation, you would use a library like web-push
  // For now, we'll simulate the push notification
  console.log("Sending web push notification:", { subscription, payload })

  // This would typically use your VAPID keys and web-push library
  // Example: await webpush.sendNotification(subscription, JSON.stringify(payload))

  return Promise.resolve()
}

export async function registerUserDevice(data: {
  userId: string
  deviceToken: string
  deviceType?: string
  deviceName?: string
  browserInfo?: string
  pushSubscription?: string | null
}) {
  try {
    const supabase = createServerClient()

    const deviceData = {
      user_id: data.userId,
      device_token: data.deviceToken,
      device_type: data.deviceType || "web",
      device_name: data.deviceName,
      browser_info: data.browserInfo,
      push_subscription: data.pushSubscription,
      is_active: true,
      last_used_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Use upsert to handle duplicate device tokens
    const { error } = await supabase.from("user_devices").upsert(deviceData, {
      onConflict: "user_id,device_token",
    })

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error registering device:", error)
    return {
      success: false,
      error: `Failed to register device: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function updateDeviceSubscription(deviceId: string, pushSubscription: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from("user_devices")
      .update({
        push_subscription: pushSubscription,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deviceId)

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating device subscription:", error)
    return { success: false, error: "Failed to update subscription" }
  }
}

export async function removeDeviceSubscription(deviceId: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from("user_devices")
      .update({
        push_subscription: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deviceId)

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error removing device subscription:", error)
    return { success: false, error: "Failed to remove subscription" }
  }
}

export async function getActiveSubscriptions(userId?: string) {
  try {
    const supabase = createServerClient()

    let query = supabase
      .from("user_devices")
      .select(`
        *,
        user:app_users!user_id(full_name, email)
      `)
      .eq("is_active", true)
      // .not("push_subscription", "is", null)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query.order("last_used_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching active subscriptions:", error)
    return { success: false, error: "Failed to fetch subscriptions", data: [] }
  }
}

export async function getUserDevices(userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("user_devices")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user devices:", error)
    return { success: false, error: "Failed to fetch devices", data: [] }
  }
}

export async function deactivateUserDevice(deviceId: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from("user_devices")
      .update({
        is_active: false,
        push_subscription: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deviceId)

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error deactivating device:", error)
    return { success: false, error: "Failed to deactivate device" }
  }
}

export async function getUserNotifications(userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("user_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user notifications:", error)
    return { success: false, error: "Failed to fetch notifications", data: [] }
  }
}

export async function getNotificationsForUser(userId: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("user_notifications")
      .select(`
        *,
        sent_by_admin:admin_users!sent_by(full_name)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user notifications:", error)
    return { success: false, error: "Failed to fetch notifications", data: [] }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from("user_notifications")
      .update({
        is_read: true,
      })
      .eq("id", notificationId)

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, error: "Failed to mark notification as read" }
  }
}

export async function getAllNotifications() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("notifications").select("*").order("sent_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return { success: false, error: "Failed to fetch notifications", data: [] }
  }
}

export async function getAllAppUserNotifications() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("user_notifications")
      .select(`
        *,
        user:app_users!user_id(full_name, email),
        sent_by_admin:admin_users!sent_by(full_name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching app user notifications:", error)
    return { success: false, error: "Failed to fetch notifications", data: [] }
  }
}
