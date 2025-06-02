'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

type MetaItem = {
  _id: string;
  name: string;
};

export default function ProductForm() {
  const { token } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [images, setImages] = useState<FileList | null>(null);

  const [categories, setCategories] = useState<MetaItem[]>([]);
  const [brands, setBrands] = useState<MetaItem[]>([]);
  const [tags, setTags] = useState<MetaItem[]>([]);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catsRes, brandsRes, tagsRes] = await Promise.all([
          fetch(`${API}/categories`),
          fetch(`${API}/brands`),
          fetch(`${API}/tags`),
        ]);
        setCategories(await catsRes.json());
        setBrands(await brandsRes.json());
        setTags(await tagsRes.json());
      } catch (err) {
        console.error('Meta fetch failed', err);
      }
    };

    fetchMeta();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error('Unauthorized');

    if (!name || !price || !stock || !categoryId || !brandId) {
      return toast.error('Please fill in all required fields.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock_quantity', stock);
    formData.append('description', description);
    formData.append('short_desc', shortDesc);
    formData.append('meta_title', metaTitle);
    formData.append('meta_description', metaDesc);
    formData.append('category_id', categoryId);
    formData.append('brand_id', brandId);
    tagIds.forEach(id => formData.append('tag_ids[]', id));

    if (images) {
      Array.from(images).forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      const res = await fetch(`${API}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create product');

      toast.success('✅ Product created');
      router.push('/admin/products');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Creation error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4 bg-white rounded-xl shadow min-h-screen">
      <h2 className="text-xl font-semibold mb-2">Create New Product</h2>

      <input value={name} onChange={e => setName(e.target.value)} placeholder="Product Name *" required className="w-full p-2 border rounded" />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price *" type="number" required className="w-full p-2 border rounded" />
      <input value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock *" type="number" required className="w-full p-2 border rounded" />
      <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="Short Description" className="w-full p-2 border rounded" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Full Description" className="w-full p-2 border rounded" />
      <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Meta Title" className="w-full p-2 border rounded" />
      <input value={metaDesc} onChange={e => setMetaDesc(e.target.value)} placeholder="Meta Description" className="w-full p-2 border rounded" />

      {/* Category Select */}
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full p-2 border rounded">
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      {/* Brand Select */}
      <select value={brandId} onChange={(e) => setBrandId(e.target.value)} required className="w-full p-2 border rounded">
        <option value="">Select Brand</option>
        {brands.map((brand) => (
          <option key={brand._id} value={brand._id}>{brand.name}</option>
        ))}
      </select>

      {/* Tags Multi-select */}
      <select multiple value={tagIds} onChange={(e) => setTagIds(Array.from(e.target.selectedOptions, o => o.value))} className="w-full p-2 border rounded">
        {tags.map((tag) => (
          <option key={tag._id} value={tag._id}>{tag.name}</option>
        ))}
      </select>

      {/* Image upload */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setImages(e.target.files)}
        className="w-full p-2 border rounded"
      />

      {/* Preview thumbnails */}
      {images && (
        <div className="flex flex-wrap gap-4 mt-2">
          {Array.from(images).map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt="Preview"
              className="w-24 h-24 object-cover rounded border"
            />
          ))}
        </div>
      )}

      <button type="submit" className="bg-[#1B1D30] hover:bg-[#70B244] text-white px-4 py-2 rounded w-full">
        Create Product
      </button>
    </form>
  );
}
