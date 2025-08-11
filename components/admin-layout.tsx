"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "./admin-sidebar-fixed"

interface AdminUser {
  id: string
  username: string
  fullName: string
  email: string
  role: string
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const adminLoggedIn = localStorage.getItem("adminLoggedIn")
      const adminUserData = localStorage.getItem("adminUser")

      if (adminLoggedIn === "true" && adminUserData) {
        const userData = JSON.parse(adminUserData)
        setCurrentAdmin(userData)
        setIsLoading(false)
      } else {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar currentAdmin={currentAdmin} />
      <div className="lg:pl-80">
        {/* Mobile spacing untuk header */}
        <div className="lg:hidden h-16"></div>
        <main className="py-6 px-4 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
