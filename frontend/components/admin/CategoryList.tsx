'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const { token } = useAuth();

  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Categories</h2>
      <table className="w-full table-auto border-collapse bg-white shadow-md rounded-2xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Slug</th>
            <th className="text-left p-3">Parent ID</th>
            <th className="text-left p-3">Created At</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat: any) => (
            <tr key={cat.id} className="border-t">
              <td className="p-3">{cat.name}</td>
              <td className="p-3">{cat.slug}</td>
              <td className="p-3">{cat.parent_id || '-'}</td>
              <td className="p-3">{new Date(cat.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}