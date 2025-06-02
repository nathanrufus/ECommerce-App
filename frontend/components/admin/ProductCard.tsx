"use client"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-hot-toast"

type Product = {
  id: number
  name: string
  slug: string
  price: number
  stock_quantity: number
  media_files?: { file_url: string }[]
}

type Props = {
  product: Product
  onDelete: (id: number) => void
}

export default function ProductCard({ product, onDelete }: Props) {
  const imageUrl = product.media_files?.[0]?.file_url
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${product.media_files[0].file_url}`
  : "/image.webp"
  console.log("Image URL:", imageUrl)


  const handleDelete = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${product.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Product deleted")
      onDelete(product.id)
    } catch (err) {
      toast.error("Could not delete product")
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="w-full h-32 relative mb-3">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <h3 className="font-medium text-sm text-[#1B1D30] truncate">{product.name}</h3>
      <p className="text-sm text-gray-600">  ${Number(product.price).toFixed(2)}
</p>
      <p
        className={`text-xs font-medium ${
          product.stock_quantity > 0 ? "text-green-600" : "text-red-500"
        }`}
      >
        {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
      </p>
      <div className="flex items-center gap-3 mt-3">
        <Link
          href={`/admin/products/${product.id}`}
          className="text-xs text-blue-600 hover:underline"
        >
          ✏️ Edit
        </Link>
        <button
          onClick={handleDelete}
          className="text-xs text-red-500 hover:underline"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}
