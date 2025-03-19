"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { deleteart, getArt, updateArt } from "../api/services/productservis"
import { Pencil, X, Trash2, ImageIcon, Loader2, Plus, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Art {
  id: string
  title: string
  detail: string
  img: string
  price: number
  status: string
}

const Products = () => {
  const [yourProducts, setYourProducts] = useState<Art[]>([])
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedArt, setSelectedArt] = useState<Art | null>(null)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState<number | "">("")
  const [detail, setDetail] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [updating, setUpdating] = useState(false)

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
      await deleteart(id)
      setYourProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleEdit = (art: Art) => {
    setSelectedArt(art)
    setTitle(art.title)
    setPrice(art.price)
    setDetail(art.detail)
    setImageFile(null)
    setIsOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedArt) return

    setUpdating(true)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("detail", detail)
    formData.append("price", price.toString())
    if (imageFile) {
      formData.append("image", imageFile)
    }

    try {
      await updateArt(selectedArt.id, formData)

      // Update the UI
      setYourProducts((prevProducts) =>
        prevProducts.map((art) =>
          art.id === selectedArt.id
            ? { ...art, title, detail, price: Number(price), img: imageFile ? URL.createObjectURL(imageFile) : art.img }
            : art,
        ),
      )

      setIsOpen(false)
    } catch (error) {
      console.error("Error updating product:", error)
    } finally {
      setUpdating(false)
    }
  }

  const filteredProducts = yourProducts
    .filter((art) => filterStatus === null || art.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "title") return a.title.localeCompare(b.title)
      // Default: newest (assuming id is somewhat chronological)
      return b.id.localeCompare(a.id)
    })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Art Gallery</h1>
          <p className="text-muted-foreground mt-1">Manage your artwork collection</p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>All Artwork</DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => setFilterStatus("")}>Available</DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => setFilterStatus("sold")}>Sold</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
               
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("title")}>Title</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-asc")}>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-desc")}>Price: High to Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <Button asChild>
            <Link href="/add-art">
              <Plus className="h-4 w-4 mr-2" />
              Add Art
            </Link>
          </Button> */}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <div className="p-4">
                <div className="h-5 w-3/4 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded mb-4" />
                <div className="h-9 w-full bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-card rounded-lg shadow-sm border">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-muted p-6 mb-6">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No artwork yet</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              {filterStatus
                ? `You don't have any ${filterStatus} artwork. Try changing your filter.`
                : "You haven't added any artwork to your gallery yet. Start showcasing your creativity!"}
            </p>
            <Button asChild>
              <Link href="/add-art">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Artwork
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((art) => (
            <div
              key={art.id}
              className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 overflow-hidden bg-muted">
                <Image
                  src={art.img || "/placeholder.svg"}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {art.status === "sold" && (
                  <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                    Sold
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold line-clamp-1 mb-1">{art.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{art.detail}</p>
                <p className="text-lg font-bold mb-3">₹{art.price}</p>

                {art.status !== "sold" && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(art)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Are you sure?</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(art.id)}
                        >
                          {deleteLoading === art.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Permanently delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && selectedArt && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Artwork</h2>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Separator />

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="edit-title"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Title
                </label>
                <input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="edit-price"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Price (₹)
                </label>
                <input
                  id="edit-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="edit-detail"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Description
                </label>
                <textarea
                  id="edit-detail"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={4}
                  required
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="edit-image"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Artwork Image
                </label>
                <div className="mb-2 relative aspect-video rounded-md overflow-hidden border">
                  <Image
                    src={imageFile ? URL.createObjectURL(imageFile) : selectedArt.img}
                    alt={selectedArt.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <input
                  id="edit-image"
                  type="file"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Leave empty to keep the current image.</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Artwork"
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

export default Products

