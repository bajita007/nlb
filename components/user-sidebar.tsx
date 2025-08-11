"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, User, FileText, BarChart3, Bell, BookOpen, LogOut, Menu, X, Home } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { clearUserSession, type UserSession } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

interface UserSidebarProps {
  currentUser: UserSession | null
}

export function UserSidebar({ currentUser }: UserSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    clearUserSession()
    toast({
      title: "Berhasil Logout",
      description: "Anda telah keluar dari sistem",
      id: ""
    })
    router.push("/user/login")
  }

  const menuItems = [
    {
      name: "Dashboard",
      href: "/user/dashboard",
      icon: Home,
      description: "Beranda pengguna",
    },
    {
      name: "Profile",
      href: "/user/profile",
      icon: User,
      description: "Informasi profil",
    },
    {
      name: "Posttest",
      href: "/user/posttest",
      icon: FileText,
      description: "Kuesioner posttest",
    },
    {
      name: "Hasil Posttest",
      href: "/user/hasil-posttest",
      icon: BarChart3,
      description: "Hasil kuesioner",
    },
    {
      name: "Notifikasi",
      href: "/user/notifikasi",
      icon: Bell,
      description: "Pesan dari admin",
    },
    {
      name: "Media Edukasi",
      href: "/user/media-edukasi",
      icon: BookOpen,
      description: "Materi pembelajaran",
    },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Dashboard User</h2>
            <p className="text-sm text-gray-600">Kesehatan Mental</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {currentUser && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-teal-100 text-teal-700">
                {currentUser.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{currentUser.full_name}</p>
              <p className="text-sm text-gray-600 truncate">{currentUser.email}</p>
            </div>
            <Badge variant={currentUser.is_active ? "default" : "secondary"} className="text-xs">
              {currentUser.is_active ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-teal-100 text-teal-700 border border-teal-200" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="space-y-3">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
            size="sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">© 2025 Universitas Hasanuddin</p>
          <p className="text-xs text-gray-500">Magister Kesehatan Masyarakat</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-1.5 rounded">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Dashboard User</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-white transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 z-30 h-full w-80 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>
    </>
  )
}
