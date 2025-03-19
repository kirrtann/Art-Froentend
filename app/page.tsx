"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createProduct } from "./api/productservis"
import { toast } from "react-hot-toast"
import { useCart } from "@/constant/cart-context"
import { Plus, X, Loader2, Search, ShoppingCart } from "lucide-react"
import { getallart, searchproduct } from "./api/services/productservis"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface Product {
  id: string
  title: string
  price: number
  img: string
  detail: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [detail, setDetail] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)

  const { addToCart } = useCart()
  const router = useRouter()

  const product = async () => {
    const response = await getallart()
    const data = response.data?.data
    return data
  }

  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    setRole(storedRole)

    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const response = await getallart()
        const data = response.data?.data
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products",error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const clearForm = () => {
    setTitle("")
    setPrice("")
    setDetail("")
    setImageFile(null)
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
      setProducts(await product())
      toast.success("Product added successfully!")
    } catch (error) {
      console.error("Error submitting product:", error)
      toast.error("Failed to add product")
    } finally {
      clearForm()
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]")
    if (cartItems.some((item: Product) => item.id === product.id)) {
      toast.error(`${product.title} is already in your cart!`)
      return
    }
    addToCart(product)
    toast.success(`${product.title} added to cart!`)
  }

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product)
    router.push("/cart")
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (!query.trim()) {
      const allProducts = await product()
      setProducts(allProducts)
      return
    }
    try {
      const response = await searchproduct(query)
      if (response && Array.isArray(response)) {
        setProducts(response)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching search results:", error)
      setProducts([])
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Art Gallery</h1>
          <p className="text-muted-foreground mt-1">Discover and collect unique artwork</p>
        </div>

        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for art..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {role === "admin" && (
            <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Art</span>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="aspect-[4/3] bg-muted animate-pulse" />
              <div className="p-6">
                <div className="h-6 w-2/3 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded mb-4" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No Artwork Found</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            We couldn&apos;t find any artwork matching your search. Try different keywords or browse our gallery.
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                product().then(setProducts)
              }}
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden group"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <Image
                  src={product.img || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 line-clamp-1">{product.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{product.detail}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">₹{product.price}</span>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button size="sm" onClick={() => handleBuyNow(product)}>
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add New Art</h2>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Separator />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Title
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter artwork title"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Price (₹)
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="detail"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Description
                </label>
                <textarea
                  id="detail"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="Describe your artwork..."
                  rows={4}
                  required
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Artwork Image
                </label>
                <input
                  id="image"
                  type="file"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                />
                {imageFile && (
                  <div className="mt-2 relative aspect-video rounded-md overflow-hidden border">
                    <Image
                      src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Add Artwork"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

