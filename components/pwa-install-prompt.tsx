"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Download, Smartphone } from "lucide-react"
import Image from "next/image"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const isInWebAppiOS = (window.navigator as any).standalone === true

    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true)
      return
    }

    const hasPromptBeenDismissed = localStorage.getItem("pwa-prompt-dismissed")
    const hasPromptShownThisSession = sessionStorage.getItem("pwa-prompt-shown")

    const laterClickTime = localStorage.getItem("pwa-prompt-later-time")
    if (laterClickTime) {
      const hoursSinceLater = (Date.now() - Number.parseInt(laterClickTime)) / (1000 * 60 * 60)
      if (hoursSinceLater < 24) {
        return // Don't show if less than 24 hours since "Nanti Saja" was clicked
      }
    }

    if (hasPromptBeenDismissed || hasPromptShownThisSession) {
      return
    }

    const lastPromptTime = localStorage.getItem("pwa-prompt-last-shown")
    if (lastPromptTime) {
      const daysSinceLastPrompt = (Date.now() - Number.parseInt(lastPromptTime)) / (1000 * 60 * 60 * 24)
      if (daysSinceLastPrompt < 1) {
        return
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      sessionStorage.setItem("pwa-prompt-shown", "true")
      localStorage.setItem("pwa-prompt-last-shown", Date.now().toString())

      // Show prompt after a short delay
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      sessionStorage.removeItem("pwa-prompt-shown")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-later-time", Date.now().toString())
    sessionStorage.setItem("pwa-prompt-shown", "true")
  }

  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm mx-auto bg-white shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-pink-100 flex items-center justify-center">
              <Image
                src="/lentera-bunda-logo.png"
                alt="LENTERA BUNDA"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>

          <CardTitle className="text-xl font-bold text-gray-900">Install LENTERA BUNDA</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Dapatkan akses cepat ke aplikasi kesehatan mental ibu hamil langsung dari layar utama perangkat Anda
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Smartphone className="h-5 w-5 text-pink-500" />
            <span>Akses offline dan notifikasi push</span>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Download className="h-5 w-5 text-pink-500" />
            <span>Pengalaman seperti aplikasi native</span>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={handleDismiss} className="flex-1 bg-transparent">
              Nanti Saja
            </Button>
            <Button onClick={handleInstallClick} className="flex-1 bg-pink-500 hover:bg-pink-600">
              Install
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
