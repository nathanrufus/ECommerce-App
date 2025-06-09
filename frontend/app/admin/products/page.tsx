"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ProductCard from "@/components/admin/ProductCard"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

type Product = {
  _id: string
  name: string
  slug: string
  price: number
  stock_quantity: number
  media_files?: { file_url: string }[]
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(true)
  const { user, token, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/")
    }

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setProducts(data.products || data)
      } catch (err) {
        console.error("Failed to fetch products", err)
      } finally {
        setLoadingProducts(false)
      }
    }

    if (!loading && isAdmin) {
      fetchProducts()
    }
  }, [loading, isAdmin])

  const handleDelete = (_id: string) => {
    setProducts((prev) => prev.filter((p) => p._id !== _id))
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 mt-20 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#1B1D30]">Available Products</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#70B244] text-black w-full sm:w-64"
          />
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-[#70B244] whitespace-nowrap"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {loadingProducts ? (
        <p className="text-center text-gray-500 mt-10">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
