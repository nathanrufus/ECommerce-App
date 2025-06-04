"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Category = {
  _id: string;
  name: string;
  slug: string;
  parent_id?: string;
  createdAt: string;
};

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { token } = useAuth();

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data.categories || data); // fallback if not wrapped
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${API_BASE}/categories/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      fetchCategories();
    } catch (err) {
      console.error("Could not delete category", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-10 h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          All Categories
        </h2>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-400 text-sm"
        >
          <FiPlus className="w-4 h-4" />
          Add Category
        </Link>
      </div>
      <table className="w-full table-auto border-collapse bg-white shadow-md rounded-2xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Slug</th>
            <th className="text-left p-3">Created At</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id} className="border-t">
              <td className="p-3">{cat.name}</td>
              <td className="p-3">{cat.slug}</td>
              <td className="p-3">
                {new Date(cat.createdAt).toLocaleDateString()}
              </td>
             <td className="p-3 flex gap-4">
              <Link
                href={`/admin/categories/${cat._id}/edit`}
                className="text-blue-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(cat._id)}
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
