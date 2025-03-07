"use client"

import { useEffect, useState } from "react"
import { getArt } from "../api/services/productservis"
import { Pencil, Trash2, Plus, ImageIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { deleteProduct } from "../api/productservis"

interface Art {
  id: string
  title: string
  detail: string
  img: string
}

const Products = () => {
  const [yourProducts, setYourProducts] = useState<Art[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const user_id = localStorage.getItem("id")
      if (!user_id) {
        console.warn("User ID not found in localStorage.")
        setLoading(false)
        return
      }

      try {
        const response = await getArt({ user_id })

        if (Array.isArray(response?.data)) {
          setYourProducts(response.data)
        } else {
          console.error("Unexpected response format:", response)
        }
      } catch (error) {
        console.error("Error fetching art:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    setDeleteLoading(id)
    try {
      await deleteProduct(id)
      setYourProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setDeleteLoading(null)
      setShowDeleteConfirm(null)
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Your Art Gallery</h1>
        <Link
          href="/add-art"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Artwork
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      ) : yourProducts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-gray-100 p-6 mb-6">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No artwork yet</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              You haven't added any artwork to your gallery yet. Start showcasing your creativity!
            </p>
            <Link
              href="/add-art"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Artwork
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {yourProducts.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {art.img ? (
                  <img
                    src={art.img || "/placeholder.svg"}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-white/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-gray-700">
                    Artwork
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="font-bold text-xl line-clamp-1 mb-2">{art.title}</h2>
                <p className="text-gray-500 text-sm line-clamp-3">{art.detail}</p>
              </div>
              <div className="p-4 pt-0 flex justify-end gap-2">
                <Link
                  href={`/edit-art/${art.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Link>

                {showDeleteConfirm === art.id ? (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                      <h3 className="text-lg font-medium mb-2">Are you sure?</h3>
                      <p className="text-gray-500 mb-4">
                        This action cannot be undone. This will permanently delete your artwork "{art.title}" from our
                        servers.
                      </p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(art.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          disabled={deleteLoading === art.id}
                        >
                          {deleteLoading === art.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(art.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                    disabled={deleteLoading === art.id}
                  >
                    {deleteLoading === art.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products

