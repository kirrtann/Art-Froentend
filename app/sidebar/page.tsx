"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingCart, LogOut, LayoutGrid, User, Brush, Home, PaintBucket } from "lucide-react"
import { useCart } from "@/constant/cart-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          "fixed h-screen z-40 transition-all duration-300 ease-in-out border-r bg-background",
          isSidebarOpen ? "w-64" : "w-20",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with logo and toggle */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
                <PaintBucket className="h-5 w-5" />
              </div>
              {isSidebarOpen && <span className="text-xl font-bold">Art Gallery</span>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Navigation links */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/" className="block">
                    <Button variant="ghost" className={cn("w-full justify-start", !isSidebarOpen && "justify-center")}>
                      <div className="relative">
                        <Home className="h-5 w-5 mr-3" />
                      </div>
                      {isSidebarOpen && <span>Home</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {!isSidebarOpen && <TooltipContent side="right">Home</TooltipContent>}
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/cart" className="block">
                    <Button variant="ghost" className={cn("w-full justify-start", !isSidebarOpen && "justify-center")}>
                      <div className="relative">
                        <ShoppingCart className="h-5 w-5 mr-3" />
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </div>
                      {isSidebarOpen && <span>Cart</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {!isSidebarOpen && <TooltipContent side="right">Cart</TooltipContent>}
              </Tooltip>

              {loginCheck && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/orders" className="block">
                        <Button
                          variant="ghost"
                          className={cn("w-full justify-start", !isSidebarOpen && "justify-center")}
                        >
                          <LayoutGrid className="h-5 w-5 mr-3" />
                          {isSidebarOpen && <span>Your Orders</span>}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    {!isSidebarOpen && <TooltipContent side="right">Your Orders</TooltipContent>}
                  </Tooltip>

                  {role === "admin" && (
                    <>
                      <Separator className="my-4" />
                      {isSidebarOpen && <p className="px-3 text-xs font-medium text-muted-foreground mb-2">Admin</p>}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href="/Productadd" className="block">
                            <Button
                              variant="ghost"
                              className={cn("w-full justify-start", !isSidebarOpen && "justify-center")}
                            >
                              <Brush className="h-5 w-5 mr-3" />
                              {isSidebarOpen && <span>Your Art</span>}
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        {!isSidebarOpen && <TooltipContent side="right">Your Art</TooltipContent>}
                      </Tooltip>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* User section at bottom */}
          <div className="p-4 border-t">
            {loginCheck ? (
              <div className="space-y-3">
                {isSidebarOpen ? (
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${uname || "user"}.png`} alt={uname || "User"} />
                      <AvatarFallback>{(uname?.charAt(0) || "U").toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{uname}</p>
                      <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                  </div>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="mx-auto">
                        <AvatarImage src={`https://avatar.vercel.sh/${uname || "user"}.png`} alt={uname || "User"} />
                        <AvatarFallback>{(uname?.charAt(0) || "U").toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{uname}</p>
                      <p className="text-xs text-muted-foreground">{role}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      {isSidebarOpen ? "Account" : ""}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  {isSidebarOpen ? "Login" : ""}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}

export default Sidebar

