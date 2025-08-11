"use client"

export interface UserSession {
  id: string
  email: string
  full_name: string
  phone_number: string | null
  is_active: boolean
  created_at: string
  last_login: string | null
}

export function getUserSession(): UserSession | null {
  if (typeof window === "undefined") return null

  try {
    const userLoggedIn = localStorage.getItem("userLoggedIn")
    const userData = localStorage.getItem("userData")

    if (userLoggedIn === "true" && userData) {
      return JSON.parse(userData) as UserSession
    }

    return null
  } catch (error) {
    console.error("Error getting user session:", error)
    return null
  }
}

export function clearUserSession() {
  if (typeof window === "undefined") return

  localStorage.removeItem("userLoggedIn")
  localStorage.removeItem("userData")
  localStorage.removeItem("userLoginTime")
}

export function isUserLoggedIn(): boolean {
  return getUserSession() !== null
}
