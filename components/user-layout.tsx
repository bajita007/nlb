"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserSidebar } from "./user-sidebar"
import { getUserSession, type UserSession } from "@/lib/auth"

interface UserLayoutProps {
  children: React.ReactNode
}

export function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const userSession = getUserSession()

      if (userSession) {
        setCurrentUser(userSession)
      } else {
        if (typeof window !== "undefined" && !window.location.pathname.includes("/user/login")) {
          router.push("/user/login")
          return
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserSidebar currentUser={currentUser} />
      <div className="lg:pl-80">
        {/* Mobile spacing untuk header */}
        <div className="lg:hidden h-16"></div>
        <main className="py-6 px-4 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
