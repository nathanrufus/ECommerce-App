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
  });
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, catRes, brandRes] = await Promise.all([
          fetch(`${API_BASE}/products/id/${productId}`),
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/brands`),
        ]);
        const productData = await productRes.json();
        const categoriesData = await catRes.json();
        const brandsData = await brandRes.json();

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
        });

        setThumbnail(product.MediaFiles?.[0]?.file_url || '');
        setCategories(categoriesData);
        setBrands(brandsData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Update failed');

      setSuccess(true);
      setTimeout(() => router.push('/admin/products'), 2000);
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
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
          <label className="block text-sm font-medium text-gray-700">Meta Title (SEO)</label>
          <input name="meta_title" value={form.meta_title} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description (SEO)</label>
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
        {thumbnail && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Image</label>
            <img src={thumbnail} alt="Product" className="w-full h-48 object-cover rounded" />
          </div>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Update Product
        </button>
      </form>
    </div>
  );
}
