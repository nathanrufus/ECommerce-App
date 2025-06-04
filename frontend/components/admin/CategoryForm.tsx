'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Category = {
  _id: string;
  name: string;
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function CategoryForm() {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || data));
  }, []);

  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    if (parentId) formData.append('parent_id', parentId);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create category');

      setSuccess(true);
      setName('');
      setSlug('');
      setParentId('');
      setThumbnailFile(null);
    } catch (err: any) {
      console.error('Category creation error:', err);
      setError(err.message || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-2xl mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category name"
          className="w-full p-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Slug"
          className="w-full p-2 border rounded-xl bg-gray-100"
          value={slug}
          readOnly
        />

        <input
          type="file"
          accept="image/*"
          className="w-full p-2 border rounded-xl"
          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
          required
        />

        {thumbnailFile && (
          <img
            src={URL.createObjectURL(thumbnailFile)}
            alt="Preview"
            className="w-full h-32 object-cover rounded-md mt-2"
          />
        )}

        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full p-2 border rounded-xl"
        >
          <option value="">No parent</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Category'}
        </button>

        {success && <p className="text-green-600">✅ Category created successfully!</p>}
        {error && <p className="text-red-600">❌ {error}</p>}
      </form>
    </div>
  );
}
