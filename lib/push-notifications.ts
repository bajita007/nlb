// Push Notification Utilities
export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered successfully:", registration)
      return registration
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      return null
    }
  }
  return null
}

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission()
    return permission
  }
  return "denied"
}

export const subscribeToPushNotifications = async (
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string,
): Promise<PushSubscription | null> => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    })

    return {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")!))),
        auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth")!))),
      },
    }
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error)
    return null
  }
}

export const sendPushNotification = async (
  userId: string,
  title: string,
  message: string,
  type = "info",
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch("/api/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        title,
        message,
        type,
      }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error sending push notification:", error)
    return { success: false, error: "Failed to send notification" }
  }
}

export const subscribeUserToPush = async (
  userId: string,
  subscription: PushSubscription,
  deviceInfo?: {
    deviceType?: string
    deviceName?: string
    browserInfo?: string
  },
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        subscription,
        deviceInfo,
      }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error subscribing to push:", error)
    return { success: false, error: "Failed to subscribe" }
  }
}

export const unsubscribeUserFromPush = async (
  userId: string,
  endpoint: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch("/api/push/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        endpoint,
      }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error unsubscribing from push:", error)
    return { success: false, error: "Failed to unsubscribe" }
  }
}
