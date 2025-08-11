"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { adminLogin } from "@/app/actions/auth-actions"
import { useToast } from "@/components/ui/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Check if already logged in
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn")
    const adminUser = localStorage.getItem("adminUser")

    if (adminLoggedIn === "true" && adminUser) {
      console.log("✅ Already logged in, redirecting to dashboard")
      router.push("/admin/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError("Username dan password harus diisi")
      setIsLoading(false)
      return
    }

    try {
      console.log("🔐 Attempting login with:", { username: credentials.username })

      const result = await adminLogin(credentials.username.trim(), credentials.password)

      console.log("🔐 Login result:", result)

      if (result.success && result.user) {
        // Store login status and user data in localStorage
        localStorage.setItem("adminLoggedIn", "true")
        localStorage.setItem("adminUser", JSON.stringify(result.user))
        localStorage.setItem("adminLoginTime", new Date().toISOString())

        console.log("✅ Login successful, stored in localStorage")

        toast({
          title: "Berhasil Login",
          description: `Selamat datang, ${result.user.fullName}!`,
          variant: "default",
        })

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 500)
      } else {
        setError(result.error || "Login gagal")
        toast({
          title: "Login Gagal",
          description: result.error || "Username atau password salah",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      const errorMessage = "Terjadi kesalahan saat login"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Quick login for development
  const handleQuickLogin = () => {
    setCredentials({
      username: "admin",
      password: "admin123",
    })
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Image */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=300&width=800"
            alt="Admin login"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
            </div>
            <div className="text-center text-white">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                  <Shield className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
              <p className="text-indigo-100">Panel Administrasi Penelitian</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8 relative z-10">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardTitle className="text-center text-xl">Masuk ke Panel Admin</CardTitle>
            <p className="text-center text-indigo-100 text-sm">Akses untuk peneliti dan administrator</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="Masukkan username"
                  className="mt-1"
                  required
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Masukkan password"
                    className="mt-1 pr-10"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1 h-8 w-8 px-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Masuk
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
