'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const { token } = useAuth();

  const fetchBrands = async () => {
    const res = await fetch(`${API_BASE}/brands`);
    const data = await res.json();
    setBrands(data);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    try {
      await fetch(`${API_BASE}/brands/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBrands();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Brands</h2>
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
          {brands.map((brand: any) => (
            <tr key={brand.id} className="border-t">
              <td className="p-3">{brand.name}</td>
              <td className="p-3">{brand.slug}</td>
              <td className="p-3">{new Date(brand.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(brand.id)}
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