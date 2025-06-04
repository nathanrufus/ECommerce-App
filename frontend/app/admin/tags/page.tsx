'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext'; 

export default function ManageTagsPage() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const { token, isAdmin } = useAuth();

  // Redirect or block non-admins (optional)
  useEffect(() => {
    if (!isAdmin) {
      alert('You are not authorized to access this page.');
      // You could also redirect to login or admin dashboard
    }
  }, [isAdmin]);

  // ✅ Fetch all tags
  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags`);
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error('Failed to fetch tags', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

 const handleCreate = async () => {
    if (!newTag.trim() || !token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ Auth token
        },
        body: JSON.stringify({ name: newTag }),
      });
      if (res.ok) {
        setNewTag('');
        fetchTags();
      } else {
        console.error('Failed to create tag');
      }
    } catch (err) {
      console.error('Failed to create tag', err);
    }
  };
  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this tag?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tags/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Auth token
        },
      });
      if (res.ok) fetchTags();
    } catch (err) {
      console.error('Failed to delete tag', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Product Tags</h1>

      {/* Create */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Enter new tag"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Tag
        </button>
      </div>

      {/* Tags Table */}
      {loading ? (
        <p className="text-gray-500">Loading tags...</p>
      ) : tags.length === 0 ? (
        <p className="text-gray-600">No tags found.</p>
      ) : (
        <ul className="space-y-2">
          {tags.map((tag: any) => (
            <li
              key={tag._id}
              className="flex justify-between items-center border border-gray-200 p-3 rounded-md"
            >
              <span className="text-gray-800">{tag.name}</span>
              <button
                onClick={() => handleDelete(tag._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
