"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import Navbar from "../navbar/page"
import { useCart } from "@/constant/cart-context"



export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const handleCheckout = () => {
    setCheckoutLoading(true)
    // Simulate checkout process
    setTimeout(() => {
      clearCart()
      setCheckoutLoading(false)
      alert("Thank you for your purchase! Your order has been placed.")
    }, 2000)
  }

  if (cartItems.length === 0) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
          <div className="flex items-center mb-6">
            <Link href="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Continue Shopping</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-center flex-1 pr-8">Your Cart</h1>
          </div>

          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-center flex-1 pr-8">Your Cart</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Cart Items ({cartItems.length})</h2>
              </div>

              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                    <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 flex-shrink-0">
                      <Image
                        src={item.img || "/placeholder.svg"}
                        alt={item.title}
                        width={120}
                        height={120}
                        style={{ width: "100%", height: "100px" }} 
                        priority
                        className="rounded-md object-contain"
                      />
                    </div>
                    <div className="flex-1 sm:ml-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-[20px] pt-10 font-semibold">{item.title}</h3>
                          {/* <p className="text-sm text-gray-500 mt-1">{item.detail.substring(0, 100)}...</p> */}
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="font-semibold">{item.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex justify-end items-center mt-4">
                        {/* <div className="flex hidden items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-gray-600 hover:text-primary"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-center w-12">{item.quantity}</span>
                         
                        </div> */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
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
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{(cartTotal * 0.12).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{(cartTotal * 1.12).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-3 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

