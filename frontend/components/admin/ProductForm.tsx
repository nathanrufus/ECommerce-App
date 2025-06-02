"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-hot-toast"

export default function ProductForm() {
  const { token } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [description, setDescription] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDesc, setMetaDesc] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [brandId, setBrandId] = useState("")
  const [tagIds, setTagIds] = useState<string[]>([])
  const [images, setImages] = useState<FileList | null>(null)

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [tags, setTags] = useState([])

  const API = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catsRes, brandsRes, tagsRes] = await Promise.all([
          fetch(`${API}/categories`),
          fetch(`${API}/brands`),
          fetch(`${API}/tags`),
        ])
        setCategories(await catsRes.json())
        setBrands(await brandsRes.json())
        setTags(await tagsRes.json())
      } catch (err) {
        console.error("Meta fetch failed", err)
      }
    }

    fetchMeta()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return toast.error("Unauthorized")

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price)
    formData.append("stock_quantity", stock)
    formData.append("description", description)
    formData.append("short_desc", shortDesc)
    formData.append("meta_title", metaTitle)
    formData.append("meta_description", metaDesc)
    formData.append("category_id", categoryId)
    formData.append("brand_id", brandId)
    tagIds.forEach(id => formData.append("tag_ids[]", id))
    if (images) {
      Array.from(images).forEach((file) => {
        formData.append("images", file)
      })
    }

    try {
      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to create product")

      toast.success("Product created")
      router.push("/admin/products")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Creation error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" required className="input" />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" required className="input" />
      <input value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock" type="number" required className="input" />
      <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="Short Description" className="input" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Full Description" className="input" />
      <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Meta Title" className="input" />
      <input value={metaDesc} onChange={e => setMetaDesc(e.target.value)} placeholder="Meta Description" className="input" />

      {/* Category Select */}
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="input">
        <option value="">Select Category</option>
        {categories.map((cat: any) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      {/* Brand Select */}
      <select value={brandId} onChange={(e) => setBrandId(e.target.value)} required className="input">
        <option value="">Select Brand</option>
        {brands.map((brand: any) => (
          <option key={brand.id} value={brand.id}>{brand.name}</option>
        ))}
      </select>

      {/* Tags Multi-select */}
      <select multiple value={tagIds} onChange={(e) => setTagIds(Array.from(e.target.selectedOptions, o => o.value))} className="input">
        {tags.map((tag: any) => (
          <option key={tag.id} value={tag.id}>{tag.name}</option>
        ))}
      </select>

      <input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)} className="input" />

      <button type="submit" className="bg-[#1B1D30] hover:bg-[#70B244] text-white px-4 py-2 rounded">Create Product</button>
    </form>
  )
}
