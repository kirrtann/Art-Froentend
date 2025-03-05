import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/constant/cart-context";
import { Toaster } from "react-hot-toast";
import Sidebar from "./sidebar/page";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Art Gallery",
  description: "Discover and buy amazing artwork",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen`}>
        <CartProvider>
          {/* Static Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* Notifications */}
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
