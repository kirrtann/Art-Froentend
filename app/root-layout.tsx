"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/constant/cart-context"
import { Toaster } from "react-hot-toast"
import Sidebar from "./sidebar/page"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
 

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token && pathname !== "/login"  ) {
      router.push("/signup")
    } 
    setIsLoading(false)
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    )
  }

  const isAuthPage = pathname === "/login" || pathname === "/signup"
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}>
      <CartProvider>
        <div className="flex h-screen overflow-hidden">
          {!isAuthPage && <Sidebar />} 
          <main className={`flex-1 ${isAuthPage ? "ml-0" : "ml-20"} overflow-y-auto transition-all duration-300`}>
            {children}
          </main>
          <Toaster position="bottom-right" />
        </div>
      </CartProvider>
    </div>
  )
}
