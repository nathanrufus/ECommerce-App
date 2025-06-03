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
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  // Fetch all categories for parent options
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || data));
  }, []);

  // Generate slug on name change
  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    // ✅ Replace these placeholders with your actual Cloudinary config
    formData.append('upload_preset', 'your_unsigned_preset');
    const CLOUD_NAME = 'your_cloud_name';

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setThumbnailUrl(data.secure_url);
        setError('');
      } else {
        setError('Image upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          slug,
          thumbnail_url: thumbnailUrl || null,
          parent_id: parentId || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to create category');

      setSuccess(true);
      setName('');
      setSlug('');
      setParentId('');
      setThumbnailUrl('');
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
        {/* Name */}
        <input
          type="text"
          placeholder="Category name"
          className="w-full p-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Slug (auto-generated) */}
        <input
          type="text"
          placeholder="Slug"
          className="w-full p-2 border rounded-xl bg-gray-100"
          value={slug}
          readOnly
        />

        {/* Thumbnail Upload */}
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 border rounded-xl"
          onChange={handleFileUpload}
          disabled={uploading}
        />

        {/* Preview */}
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="Thumbnail Preview"
            className="w-full h-32 object-cover rounded-md mt-2"
          />
        )}

        {/* Parent Category */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || uploading}
        >
          {loading ? 'Saving...' : 'Save Category'}
        </button>

        {/* Status Messages */}
        {success && <p className="text-green-600">✅ Category created successfully!</p>}
        {error && <p className="text-red-600">❌ {error}</p>}
      </form>
    </div>
  );
}
