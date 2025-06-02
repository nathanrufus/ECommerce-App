'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FiPlus } from "react-icons/fi";
import Link from "next/link";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Brand = {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export default function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const { token } = useAuth();

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${API_BASE}/brands`);
      const data = await res.json();
      setBrands(data.brands || data); // compatible with both formats
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (_id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    try {
      const res = await fetch(`${API_BASE}/brands/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Delete failed');
      fetchBrands();
    } catch (err) {
      console.error('Could not delete brand:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-screen mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">All Brands</h2>
        <Link
          href="/admin/brands/new"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-400 text-sm"
        >
          <FiPlus className="w-4 h-4" />
          Add Brand
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
          {brands.map((brand) => (
            <tr key={brand._id} className="border-t">
              <td className="p-3">{brand.name}</td>
              <td className="p-3">{brand.slug}</td>
              <td className="p-3">
                {new Date(brand.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(brand._id)}
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
