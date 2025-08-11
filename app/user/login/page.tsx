"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Heart, LogIn, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authenticateAppUser } from "@/app/actions/user-actions"

export default function UserLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Email dan password harus diisi",
        variant: "destructive",
        id: ""
      })
      return
    }

    try {
      setIsLoading(true)
      const result = await authenticateAppUser(email.trim(), password.trim())

      if (result.success && result.user) {
        // Store user session
        localStorage.setItem("userLoggedIn", "true")
        localStorage.setItem("userData", JSON.stringify(result.user))
        localStorage.setItem("userLoginTime", new Date().toISOString())

        toast({
          title: "Berhasil Login",
          description: `Selamat datang, ${result.user.full_name}!`,
          id: ""
        })

        router.push("/user/dashboard")
      } else {
        toast({
          title: "Login Gagal",
          description: result.error || "Email atau password salah",
          variant: "destructive",
          id: ""
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive",
        id: ""
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=200&width=800"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-4 py-8">
          <div className="max-w-md mx-auto text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <Heart className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Login Pengguna</h1>
            <p className="text-cyan-100 text-sm">Masuk ke dashboard pribadi Anda</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-10">
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-white text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl text-gray-800">
              <LogIn className="h-6 w-6 text-teal-600" />
              Masuk ke Akun Anda
            </CardTitle>
            <CardDescription>Masukkan email dan password yang telah terdaftar</CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="border-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="border-2 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Masuk...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Masuk
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">Belum punya akun? Hubungi administrator untuk mendaftar.</p>

              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500 pb-8">
          <p>© 2025 Universitas Hasanuddin - Program Magister Kesehatan Masyarakat</p>
        </div>
      </div>
    </div>
  )
}
