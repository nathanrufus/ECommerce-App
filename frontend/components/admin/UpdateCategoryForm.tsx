'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Category = {
  _id: string;
  name: string;
  slug: string;
  parent_id?: string;
  thumbnail_url?: string;
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function UpdateCategoryForm() {
  const { token } = useAuth();
  const { id } = useParams();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all categories
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data || []));
  }, []);

  useEffect(() => {
    // Fetch current category data
    if (!id) return;
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => {
        const cat = data.find((c: Category) => c._id === id);
        if (cat) {
          setName(cat.name);
          setSlug(cat.slug);
          setParentId(cat.parent_id || '');
          setExistingThumbnail(cat.thumbnail_url || '');
        }
      });
  }, [id]);

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
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update category');

      setSuccess(true);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Error updating category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-2xl mt-10 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category name"
          className="w-full p-2 border rounded-xl"
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
        />

        {existingThumbnail && !thumbnailFile && (
          <img
            src={existingThumbnail}
            alt="Current Thumbnail"
            className="w-full h-32 object-cover rounded-md"
          />
        )}

        {thumbnailFile && (
          <img
            src={URL.createObjectURL(thumbnailFile)}
            alt="Preview"
            className="w-full h-32 object-cover rounded-md"
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
          {loading ? 'Updating...' : 'Update Category'}
        </button>

        {success && <p className="text-green-600">✅ Category updated successfully!</p>}
        {error && <p className="text-red-600">❌ {error}</p>}
      </form>
    </div>
  );
}
