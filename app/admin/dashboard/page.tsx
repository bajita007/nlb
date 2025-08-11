"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Bell,
  Building2,
  Smartphone,
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
  ShieldCheck,
} from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { testDatabaseSetup } from "@/app/actions/auth-actions"
import { useToast } from "@/components/ui/use-toast"

interface DatabaseStatus {
  connected: boolean
  adminUsers: any[]
  respondentsCount: number
  notificationsCount: number
  error?: string
}

interface DashboardStats {
  totalRespondents: number
  veryLowRiskCount: number // 0-9
  mildMediumRiskCount: number // 10-12
  mediumSevereRiskCount: number // 13-20
  severeRiskCount: number // >20
  healthUnitsCount: number
  devicesCount: number
  todaySubmissions: number
  weeklyGrowth: number
}

export default function AdminDashboardPage() {
  const { toast } = useToast()
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus>({
    connected: false,
    adminUsers: [],
    respondentsCount: 0,
    notificationsCount: 0,
  })
  const [stats, setStats] = useState<DashboardStats>({
    totalRespondents: 0,
    veryLowRiskCount: 0,
    mildMediumRiskCount: 0,
    mediumSevereRiskCount: 0,
    severeRiskCount: 0,
    healthUnitsCount: 0,
    devicesCount: 0,
    todaySubmissions: 0,
    weeklyGrowth: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Test database connection
      const result = await testDatabaseSetup()

      if (result.success) {
        const totalRespondents = result.data?.respondentsCount || 0
        // Mock distribution for new risk categories
        const veryLowRisk = Math.floor(totalRespondents * 0.4) // 40%
        const mildMediumRisk = Math.floor(totalRespondents * 0.3) // 30%
        const mediumSevereRisk = Math.floor(totalRespondents * 0.2) // 20%
        const severeRisk = totalRespondents - veryLowRisk - mildMediumRisk - mediumSevereRisk // Remaining

        setDatabaseStatus({
          connected: true,
          adminUsers: result.data?.adminUsers || [],
          respondentsCount: totalRespondents,
          notificationsCount: result.data?.notificationsCount || 0,
        })

        // Update stats with real data
        setStats((prev) => ({
          ...prev,
          totalRespondents: totalRespondents,
          veryLowRiskCount: veryLowRisk,
          mildMediumRiskCount: mildMediumRisk,
          mediumSevereRiskCount: mediumSevereRisk,
          healthUnitsCount: result.data?.uniqueHealthCount || 0,
          severeRiskCount: severeRisk,
          devicesCount: totalRespondents, // Assume 1 device per respondent
          todaySubmissions: Math.floor(Math.random() * 5), // Mock today's submissions
          weeklyGrowth: Math.floor(Math.random() * 20) + 5, // Mock weekly growth
        }))
      } else {
        setDatabaseStatus({
          connected: false,
          adminUsers: [],
          respondentsCount: 0,
          notificationsCount: 0,
          error: result.error,
        })
      }
    } catch (error) {
      console.error("Error loading dashboard:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data dashboard",
        variant: "destructive",
        id: ""
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Ringkasan data penelitian kesehatan mental ibu hamil</p>
        </div>

        {/* Main Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {" "}
          {/* Adjusted grid for 3 cards */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Responden</p>
                  <p className="text-2xl font-bold">{stats.totalRespondents}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />+{stats.weeklyGrowth}% minggu ini
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Removed Risiko Tinggi card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unit Pelayanan</p>
                  <p className="text-2xl font-bold">{stats.healthUnitsCount}</p>
                  <p className="text-xs text-gray-500">Puskesmas & RS</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Perangkat Aktif</p>
                  <p className="text-2xl font-bold">{stats.devicesCount}</p>
                  <p className="text-xs text-gray-500">Device terdaftar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hari Ini</p>
                  <p className="text-2xl font-bold">{stats.todaySubmissions}</p>
                  <p className="text-xs text-gray-500">Responden baru</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Bell className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notifikasi</p>
                  <p className="text-2xl font-bold">{databaseStatus.notificationsCount}</p>
                  <p className="text-xs text-gray-500">Pesan terkirim</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Activity className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tingkat Respons</p>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-gray-500">Kuesioner lengkap</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Database Status */}
        <Card className={databaseStatus.connected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${databaseStatus.connected ? "text-green-800" : "text-red-800"}`}
            >
              <BarChart3 className="h-5 w-5" />
              Status Sistem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className={`text-lg ${databaseStatus.connected ? "text-green-600" : "text-red-600"}`}>
                  {databaseStatus.connected ? "Terhubung" : "Error"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Admin Users</p>
                <p className="text-lg">{databaseStatus.adminUsers.length} aktif</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Update</p>
                <p className="text-lg">{new Date().toLocaleTimeString("id-ID")}</p>
              </div>
            </div>
            {databaseStatus.error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{databaseStatus.error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - Now only the Risk Categories card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {" "}
          {/* Keep grid for potential future additions, but it will center the single card */}
          {/* New Card: Respondent Risk Categories */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer col-span-full md:col-span-2 lg:col-span-4">
            {" "}
            {/* Make it span full width */}
            <CardContent className="p-6 text-center">
              <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <h3 className="font-medium">Kategori Risiko Responden</h3>
              <div className="text-sm text-gray-700 mt-2 space-y-1">
                <p>0-9 Gejala Sangat Ringan</p>
                <p>10-12 Gejala Ringan-Sedang</p>
                <p>13-20 Gejala Sedang-Berat</p>
                <p>Diatas 20 Berat</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
