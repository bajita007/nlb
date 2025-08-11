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

    const notificationData = {
      user_id: data.userId,
      title: data.title,
      message: data.message,
      sent_by: data.sentBy || null,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("user_notifications").insert(notificationData)

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    revalidatePath("/admin/notifications")
    return { success: true }
  } catch (error) {
    console.error("Error sending notification to app user:", error)
    return {
      success: false,
      error: `Failed to send notification: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
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
