"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Trash2, ShoppingCart, CreditCard, Package, AlertCircle } from "lucide-react"
import { useCart } from "@/constant/cart-context"
import { Cartdata } from "../api/services/productservis"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    setCheckoutError("")

    const cartData = JSON.parse(localStorage.getItem("cart") || "[]")
    const userId = localStorage.getItem("id")

    if (!userId) {
      setCheckoutError("Please log in to complete your purchase.")
      setCheckoutLoading(false)
      return
    }

    if (cartData.length === 0) {
      setCheckoutError("Your cart is empty.")
      setCheckoutLoading(false)
      return
    }

    try {
      const orderRequests = cartData.map((item:any) => Cartdata({ user_id: userId, product_id: item.id }))
      await Promise.all(orderRequests)
      clearCart()
      alert("Thank you for your purchase! Your order has been placed.")
    } catch (error) {
      console.error("Error during checkout:", error)
      setCheckoutError("Something went wrong. Please try again.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4 sm:mb-0">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Your Cart</h1>
          <div className="w-[140px]"></div> {/* Spacer for alignment */}
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-gray-100 p-6 mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Looks like you haven't added any items to your cart yet. Browse our gallery to find something you'll love.
            </p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Browse Gallery
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4 sm:mb-0">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Continue Shopping</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Your Cart</h1>
        <div className="w-[140px]"></div> {/* Spacer for alignment */}
      </div>

      {checkoutError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{checkoutError}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart Items ({cartItems.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={item.img || "/placeholder.svg"}
                      alt={item.title}
                      width={160}
                      height={160}
                      className="w-full h-full object-contain"
                      priority
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.detail ? `${item.detail.substring(0, 100)}...` : "No description available"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">${item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex justify-end items-center mt-4">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (12%)</span>
                <span>${(cartTotal * 0.12).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${(cartTotal * 1.12).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <button
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </>
                )}
              </button>
              <button
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

