import type React from "react"
import type { Metadata } from "next"
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

export const metadata: Metadata = {
  title: "The Art Gallery",
  description: "Discover and buy amazing artwork",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}>
        <CartProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 ml-20  sm:p-4 overflow-y-auto transition-all duration-300">{children}</main>
            <Toaster position="bottom-right" />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}

