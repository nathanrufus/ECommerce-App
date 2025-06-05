'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminProductEditForm() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    short_desc: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    brand_id: '',
    meta_title: '',
    meta_description: '',
    tag_ids: [] as string[], // ✅ include tags
  });
  const [loading, setLoading] = useState(true);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, catRes, brandRes, tagsRes] = await Promise.all([
          fetch(`${API_BASE}/products/id/${productId}`),
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/brands`),
          fetch(`${API_BASE}/tags`),
        ]);
        const productData = await productRes.json();
        const categoriesData = await catRes.json();
        const brandsData = await brandRes.json();
        const tagsData = await tagsRes.json();

        const product = productData;
        setProduct(product);

        setForm({
          name: product.name || '',
          description: product.description || '',
          short_desc: product.short_desc || '',
          price: product.price || '',
          stock_quantity: product.stock_quantity || '',
          category_id: product.category_id?._id || '',
          brand_id: product.brand_id?._id || '',
          meta_title: product.meta_title || '',
          meta_description: product.meta_description || '',
          tag_ids: product.tags?.map((tag: any) => tag._id) || [],
        });

        setCategories(categoriesData);
        setBrands(brandsData);
        setTags(tagsData);
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) load();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((prev) => ({ ...prev, tag_ids: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;

      if (newImages.length > 0) {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
          } else {
            formData.append(key, value);
          }
        });
        newImages.forEach((file) => {
          formData.append('images', file);
        });

        res = await fetch(`${API_BASE}/products/${productId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        res = await fetch(`${API_BASE}/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) throw new Error('Update failed');

      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 2000);
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const handleDeleteImage = async (mediaId: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch(`${API_BASE}/media/${mediaId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete image');

      setProduct((prev: any) => ({
        ...prev,
        MediaFiles: prev.MediaFiles.filter((m: any) => m._id !== mediaId),
      }));
    } catch (err) {
      console.error('Image deletion failed:', err);
    }
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl mt-10 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Product</h2>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-2 rounded mb-4">
          ✅ Product updated successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description</label>
          <textarea name="short_desc" value={form.short_desc} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Title</label>
          <input name="meta_title" value={form.meta_title} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <input name="meta_description" value={form.meta_description} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <select name="brand_id" value={form.brand_id} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Brand</option>
            {brands.map((brand: any) => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* ✅ TAG SELECTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <select
            name="tag_ids"
            multiple
            value={form.tag_ids}
            onChange={handleTagChange}
            className="w-full p-2 border rounded h-32"
          >
            {tags.map((tag: any) => (
              <option key={tag._id} value={tag._id}>{tag.name}</option>
            ))}
          </select>
        </div>

        {/* ✅ Upload New Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload New Images</label>
          <input type="file" multiple accept="image/*" onChange={handleNewImageChange} className="w-full p-2 border rounded" />
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {previewUrls.map((url, idx) => (
              <img key={idx} src={url} alt={`Preview ${idx}`} className="w-full h-32 object-cover rounded border" />
            ))}
          </div>
        )}

        {/* ✅ Existing Images */}
        {product?.MediaFiles?.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Existing Images</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {product.MediaFiles.map((img: any) => (
                <div key={img._id} className="relative group">
                  <img src={img.file_url} alt="Product Media" className="w-full h-32 object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img._id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Update Product
        </button>
      </form>
    </div>
  );
}
