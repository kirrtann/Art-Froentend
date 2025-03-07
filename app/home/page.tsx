"use client"
import type React from "react"
import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { createProduct, fetchProducts } from "../api/productservis"

import { toast } from "react-hot-toast"
import { useCart } from "@/constant/cart-context"

interface Product {
  id: string
  title: string
  price: number
  img: string
  detail: string
}

const Main = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [detail, setDetail] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    setRole(storedRole)

    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products")
      }
    }

    loadProducts()
  }, [])

  const clearForm = () => {
    setTitle("")
    setPrice("")
    setDetail("")
    setImageFile(null)
    setEditId(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("price", price)
    formData.append("detail", detail)
    if (imageFile) formData.append("image", imageFile)

    try {
      await createProduct(formData)
      setIsOpen(false)
      setProducts(await fetchProducts())
    } catch (error) {
      console.error("Error submitting product:", error)
    } finally {
      clearForm()
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cartItems.some((item: Product) => item.id === product.id)) {
      toast.error(`${product.title} is already in your cart!`);
      return;
    }
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    router.push("/cart");
  };

  return (
    <>

      <div className="container mx-auto max-w-[1440px] font-mono p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Art Gallery</h1>
          {role === "admin" && (
            <button
              onClick={() => setIsOpen(true)}
              className="bg-blue-500 text-white sm:px-4 sm:py-2 px-2 py-1 rounded-md shadow-md hover:bg-blue-600 transition"
            >
              Add Art
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map((product) => (
              <div
                key={product.id}
                className="border relative p-4 h-[400px] rounded-lg shadow-lg bg-white transition transform hover:scale-105 hover:shadow-xl"
              >
                <Image
                  src={product.img || "/placeholder.svg"}
                  alt={product.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="text-xl font-semibold mt-2 text-gray-800">{product.title}</h3>
                <p className="text-gray-500 text-sm">{product.detail}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">₹{product.price}</p>
                {/* <p className="  text-lg font-bold">{product.user.name}</p> */}
                <div className="flex absolute bottom-2 gap-x-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md shadow hover:bg-gray-400 transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop with blur effect */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />

            {/* Modal */}
            <div
              className="relative w-full max-w-md transform scale-100 transition-all duration-300 ease-in-out"
              style={{ opacity: isOpen ? 1 : 0 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{"Add New Art"}</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        placeholder="Product title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Price
                      </label>
                      <input
                        id="price"
                        type="number"
                        placeholder="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="detail"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Details
                      </label>
                      <textarea
                        id="detail"
                        placeholder="Product description"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Product Image
                      </label>
                      <div className="relative">
                        <input
                          id="image"
                          type="file"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer with actions */}
                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : editId ? (
                        "Update Product"
                      ) : (
                        "Add Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Main

