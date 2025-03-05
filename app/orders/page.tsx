"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronUp, ArrowLeft, ShoppingBag } from "lucide-react"

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  // Example orders data - in a real app, this would come from an API
  const orders = [
    {
      id: "ORD-2023-1001",
      date: "March 15, 2023",
      total: "$1,250.00",
      status: "Delivered",
      items: [
        {
          id: "ART-001",
          name: "Abstract Harmony",
          artist: "Elena Rodriguez",
          price: "$850.00",
          image: "/placeholder.svg?height=120&width=120",
          size: '24" x 36"',
          medium: "Acrylic on Canvas",
        },
        {
          id: "ART-002",
          name: "Urban Landscape",
          artist: "Michael Chen",
          price: "$400.00",
          image: "/placeholder.svg?height=120&width=120",
          size: '18" x 24"',
          medium: "Oil on Canvas",
        },
      ],
    },
    {
      id: "ORD-2023-0892",
      date: "February 28, 2023",
      total: "$720.00",
      status: "padding",
      items: [
        {
          id: "ART-045",
          name: "Serenity in Blue",
          artist: "Sarah Johnson",
          price: "$720.00",
          image: "/placeholder.svg?height=120&width=120",
          size: '30" x 40"',
          medium: "Mixed Media",
        },
      ],
    },
    {
      id: "ORD-2023-0754",
      date: "January 12, 2023",
      total: "$1,800.00",
      status: "Delivered",
      items: [
        {
          id: "ART-089",
          name: "Golden Sunset",
          artist: "David Williams",
          price: "$1,200.00",
          image: "/placeholder.svg?height=120&width=120",
          size: '36" x 48"',
          medium: "Oil on Canvas",
        },
        {
          id: "ART-112",
          name: "Whispers of Nature",
          artist: "Amelia Parker",
          price: "$600.00",
          image: "/placeholder.svg?height=120&width=120",
          size: '20" x 24"',
          medium: "Watercolor",
        },
      ],
    },
  ]

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Gallery</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-center flex-1 pr-8">Your Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't made any purchases yet.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Browse Gallery
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <div>
                    <p className="text-sm text-gray-500">Order Placed</p>
                    <p className="font-medium">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">{order.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleOrderExpand(order.id)}
                  className="mt-4 sm:mt-0 flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  {expandedOrder === order.id ? (
                    <>
                      <span className="mr-1">Hide details</span>
                      <ChevronUp className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      <span className="mr-1">View details</span>
                      <ChevronDown className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              {expandedOrder === order.id && (
                <div className="p-4 sm:p-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <div className="space-y-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-100 pb-6">
                        <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={120}
                            height={120}
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-1 sm:ml-6">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h4 className="text-base font-semibold">{item.name}</h4>
                              
                              
                            </div>
                            <div className="mt-2 sm:mt-0 text-right">
                              <p className="font-semibold">{item.price}</p>
                            </div>
                          </div>
                         
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        John Doe
                        <br />
                        123 Art Street
                        <br />
                        New York, NY 10001
                        <br />
                        United States
                      </p>
                    </div>
                    
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

