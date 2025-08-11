"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Home,
  Users,
  Building2,
  MessageSquare,
  Smartphone,
  User,
  LogOut,
  BarChart3,
  X,
  Bell,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface AdminUser {
  id: string
  username: string
  fullName: string
  email: string
  role: string
}

interface AdminSidebarProps {
  currentAdmin: AdminUser | null
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
    description: "Ringkasan data",
  },
  {
    title: "Data Responden",
    href: "/admin/respondents",
    icon: Users,
    description: "Kelola data responden",
  },
  {
    title: "Unit Pelayanan",
    href: "/admin/health-units",
    icon: Building2,
    description: "Kelola unit kesehatan",
  },
  // {
  //   title: "Kuesioner",
  //   href: "/admin/questionnaire",
  //   icon: MessageSquare,
  //   description: "Kelola pertanyaan",
  // },
  // {
  //   title: "Device & Users",
  //   href: "/admin/devices",
  //   icon: Smartphone,
  //   description: "Daftar perangkat",
  // },
  {
    title: "Manajemen Pengguna",
    href: "/admin/users",
    icon: UserPlus,
    description: "Kelola pengguna app",
  },
  {
    title: "Notifikasi",
    href: "/admin/notifications",
    icon: Bell,
    description: "Kirim notifikasi",
  },
  {
    title: "Profil",
    href: "/admin/profile",
    icon: User,
    description: "Pengaturan akun",
  },
]

export function AdminSidebar({ currentAdmin }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminUser")
    localStorage.removeItem("adminLoginTime")

    toast({
      title: "Berhasil Logout",
      description: "Anda telah keluar dari sistem",
    })

    router.push("/admin/login")
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <p className="text-sm text-gray-600">Penelitian Kesehatan</p>
            </div>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={closeSidebar} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {currentAdmin && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-900">{currentAdmin.fullName}</p>
            <p className="text-sm text-blue-600">
              {currentAdmin.username} • {currentAdmin.role}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`block w-full text-left px-3 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar
        </Button>
      </div>
    </div>
  )

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            console.log("Menu button clicked, current state:", isOpen)
            setIsOpen(true)
          }}
          className="hover:bg-gray-100"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>

        <div className="w-10" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeSidebar} />
          <div className="fixed left-0 top-0 h-full w-80 max-w-[80vw] transform transition-transform duration-300 ease-in-out">
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 lg:bg-white lg:border-r">
        <SidebarContent />
      </div>
    </>
  )
}
