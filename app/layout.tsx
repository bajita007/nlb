import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import PWAInstallPrompt from "@/components/pwa-install-prompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LENTERA BUNDA - Kesehatan Mental Ibu Hamil",
  description: "Aplikasi untuk mendeteksi tingkat kecemasan dan depresi pada ibu hamil trimester 3",
  manifest: "/manifest.json",
  themeColor: "#9f4a5f",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  // generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/lentera-bunda-logo.png" />
        <link rel="apple-touch-icon" href="/lentera-bunda-logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LENTERA BUNDA" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <PWAInstallPrompt />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
