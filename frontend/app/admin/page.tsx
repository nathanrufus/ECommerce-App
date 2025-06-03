'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // adjust the path if needed
import {
  FiBox,
  FiTag,
  FiShoppingCart,
  FiHome,
} from 'react-icons/fi';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold text-lg">
          Unauthorized – Admins only.
        </p>
      </div>
    );
  }

  const links = [
    { href: '/admin/products', label: 'Products', icon: <FiBox /> },
    { href: '/admin/products/new', label: 'Add Product', icon: <FiBox /> },
    { href: '/admin/categories', label: 'Categories', icon: <FiTag /> },
    { href: '/admin/categories/new', label: 'Add Category', icon: <FiTag /> },
    { href: '/admin/brands', label: 'Brands', icon: <FiTag /> },
    { href: '/admin/orders', label: 'Orders', icon: <FiShoppingCart /> },
    { href: '/', label: 'Go to Storefront', icon: <FiHome /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 p-4 rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-50 transition"
            >
              <div className="text-green-600 text-xl">{link.icon}</div>
              <span className="text-sm font-medium text-gray-800">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Quick Overview (Coming Soon)</h2>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Total orders today</li>
            <li>Low stock alerts</li>
            <li>New customer signups</li>
            <li>Recent reviews</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
