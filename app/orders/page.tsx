"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ShoppingBag, Calendar, Package, Download } from "lucide-react"
import { Getorder } from "../api/services/productservis"

interface Product {
  id: string;
  title: string;
  img: string;
  price: number;
}
interface Order {
  id: string;
  created_at: string;
  product: Product;
  invoice_url: string;
}
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const user_id = localStorage.getItem("id")
      if (!user_id) {
        setLoading(false)
        return
      }

      try {
        const response = await Getorder({ user_id })
        setOrders(response)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    // const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined)
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4 sm:mb-0">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Gallery</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Your Orders</h1>
        <div className="w-[100px]"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-gray-100 p-6 mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Looks like you haven&apos;t made any purchases yet. Browse our gallery to find something you&apos;ll love.
            </p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Browse Gallery
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={order.product.img || "/placeholder.svg"}
                    alt={order.product.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg line-clamp-1">{order.product.title}</h3>
                    <span className="ml-2 shrink-0 text-sm px-2 py-1 bg-gray-100 rounded-full">
                      ₹{order.product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 my-3"></div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Ordered on: {formatDate(order.created_at)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Package className="h-4 w-4 mr-2" />
                      <span>Order ID: #{order.id.substring(0, 8)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <a
                      href={order.invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-5 w-5 mr-2" /> Download Invoice
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
