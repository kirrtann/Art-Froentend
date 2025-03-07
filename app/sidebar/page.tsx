"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingCart, LogOut, LayoutGrid, User, Brush, Home, PaintBucket } from "lucide-react"
import { useCart } from "@/constant/cart-context"

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [loginCheck, setLoginCheck] = useState<string | null>(null)
  const [uname, setUname] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const { cartCount } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoginCheck(localStorage.getItem("token"))
      setUname(localStorage.getItem("email"))
      setRole(localStorage.getItem("role"))
    }
  }, [])

  const logout = () => {
    localStorage.clear()
    setLoginCheck(null)
    router.push("/login")
  }

  return (
    <aside
      className={`fixed h-screen z-40 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-gray-900 text-white`}
    >
      <div className="flex flex-col h-full">
        {/* Header with logo and toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <PaintBucket className="h-8 w-8 text-blue-400" />
            {isSidebarOpen && <span className="text-xl font-bold">Art Gallery</span>}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-800 group transition-colors"
              >
                <Home className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                {isSidebarOpen && <span className="ml-3 transition-opacity duration-200">Home</span>}
              </Link>
            </li>

            <li>
              <Link
                href="/cart"
                className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-800 group transition-colors"
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                {isSidebarOpen && <span className="ml-3 transition-opacity duration-200">Cart</span>}
              </Link>
            </li>

            {loginCheck && (
              <>
                <li>
                  <Link
                    href="/orders"
                    className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-800 group transition-colors"
                  >
                    <LayoutGrid className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                    {isSidebarOpen && <span className="ml-3 transition-opacity duration-200">Your Orders</span>}
                  </Link>
                </li>

                {role === "admin" && (
                  <li>
                    <Link
                      href="/Productadd"
                      className="flex items-center p-3 text-base font-medium rounded-lg hover:bg-gray-800 group transition-colors"
                    >
                      <Brush className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      {isSidebarOpen && <span className="ml-3 transition-opacity duration-200">Your Art</span>}
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>

        {/* User section at bottom */}
        <div className="p-4 border-t border-gray-800">
          {loginCheck ? (
            <div className="space-y-3">
              {isSidebarOpen && (
                <div className="px-2 py-1">
                  <p className="text-sm text-gray-400">Logged in as</p>
                  <p className="text-sm font-medium truncate">{role}</p>
                </div>
              )}
              <button
                onClick={logout}
                className="flex items-center w-full p-3 text-base font-medium rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 group transition-colors"
              >
                <LogOut className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Logout</span>}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center w-full p-3 text-base font-medium rounded-lg text-blue-400 hover:bg-gray-800 hover:text-blue-300 group transition-colors"
            >
              <User className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Login</span>}
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

