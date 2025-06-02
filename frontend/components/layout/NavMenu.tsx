'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function NavMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <nav className="bg-gray-100 text-sm text-gray-800 relative z-10 border-b border-gray-200 shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between md:justify-start gap-6">
          {/* 🔘 Sidebar Toggle */}
         <button
  onClick={() => setSidebarOpen(true)}
  className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-800 hover:border-green-600 hover:text-green-600 transition font-medium shadow-sm"
>
  <FiMenu className="w-5 h-5" />
  <span className="hidden sm:inline">Browse Categories</span>
</button>


          {/* 🔗 Navigation Links */}
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              { name: 'About Us', href: '/about' },
              { name: 'Track Order', href: '/track-order' },
              { name: 'Return Policy', href: '/return-policy' },
              { name: 'Warranty', href: '/warranty' },
              { name: 'Support', href: '/support' },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-green-600 transition font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* 📦 Sidebar with overlay */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
<div
  className="fixed inset-0 bg-black/20 z-40"
  onClick={closeSidebar}
/>

{/* Sidebar */}
<aside className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-2xl z-50 rounded-r-lg transform transition-transform duration-300 overflow-y-auto">
  <div className="flex items-center justify-between p-4 border-b border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800 tracking-wide">📂 Categories</h2>
    <button
      onClick={closeSidebar}
      className="text-gray-500 hover:text-red-500 text-2xl font-bold focus:outline-none"
      aria-label="Close Sidebar"
    >
      &times;
    </button>
  </div>

  <ul className="p-4 space-y-3 text-sm">
    {categories.length > 0 ? (
      categories.map((cat) => (
        <li key={cat.id}>
          <Link
            href={`/products?category=${cat.slug}`}
            onClick={closeSidebar}
            className="block px-3 py-2 rounded-md text-gray-800 hover:bg-green-100 hover:text-green-700 font-medium transition"
          >
            {cat.name}
          </Link>
        </li>
      ))
    ) : (
      <li className="text-gray-400 italic">No categories available</li>
    )}
  </ul>
</aside>

        </>
      )}
    </>
  );
}
