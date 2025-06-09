'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiUser, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default function NavMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <nav className="bg-[#F8FAF8] dark:bg-[#121423] text-sm text-[#1B1D30] dark:text-white relative z-10 border-b border-gray-200 dark:border-[#1B1D30] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
          {/* 🔘 Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#70B244] rounded-md bg-white dark:bg-[#1B1D30] text-[#1B1D30] dark:text-white hover:bg-[#70B244] hover:text-white transition font-medium shadow-sm shrink-0"
          >
            <FiMenu className="w-5 h-5" />
            <span className="hidden sm:inline">Browse Categories</span>
          </button>

          {/* 🔗 Scrollable Links */}
          <div className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth">
            <div className="flex gap-4 whitespace-nowrap">
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
                  className="text-[#1B1D30] dark:text-white hover:text-[#70B244] transition font-medium shrink-0"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 👑 Admin Menu */}
          {isAdmin && (
            <div className="relative shrink-0">
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-[#1B1D30] dark:border-white rounded-md bg-white dark:bg-[#1B1D30] text-[#1B1D30] dark:text-white hover:bg-[#70B244]/10 hover:text-[#70B244] transition font-semibold shadow-sm"
              >
                <FiUser className="w-4 h-4" />
                Admin Menu
                <FiChevronDown className="w-4 h-4" />
              </button>

              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-[#1B1D30] border border-gray-200 dark:border-gray-700 z-50">
                  <ul className="text-sm text-[#1B1D30] dark:text-white divide-y divide-gray-100 dark:divide-[#2A2D45]">
                    {[
                      { name: 'All Products', href: '/admin/products' },
                      { name: 'Add Product', href: '/admin/products/new' },
                      { name: 'Categories', href: '/admin/categories' },
                      { name: 'Add Category', href: '/admin/categories/new' },
                      { name: 'Brands', href: '/admin/brands' },
                      { name: 'Orders', href: '/admin/orders' },
                      { name: 'Storefront', href: '/' },
                      { name: 'Tags', href: '/admin/tags' },
                      { name: 'Users', href: '/admin/users' },
                    ].map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          onClick={() => setAdminMenuOpen(false)}
                          className="block px-4 py-2 hover:bg-[#70B244]/10 hover:text-[#70B244] transition"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* 📦 Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={closeSidebar} />
          <aside className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-white via-[#F8FAF8] to-[#E9F1E9] dark:from-[#1B1D30] dark:via-[#202439] dark:to-[#1E2233] shadow-2xl z-50 rounded-r-xl transform transition-transform duration-300 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-semibold text-[#1B1D30] dark:text-white tracking-wide">📂 Categories</h2>
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
                  <li key={cat._id}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      onClick={closeSidebar}
                      className="block px-3 py-2 rounded-md text-[#1B1D30] dark:text-white hover:bg-[#70B244]/20 hover:text-[#70B244] font-medium transition"
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
