import React from 'react';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiUser } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
<Image
  src="/kwala.png"
  alt="Kwalas Computer"
  width={36}
  height={36}
  className="rounded-full border-2 border-white shadow-sm"
/>
          <span className="text-lg font-semibold tracking-wide">Kwalas Computers</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Search computers, accessories, or brands..."
            className="w-full px-4 py-2 rounded-md text-black text-sm focus:outline-none"
          />
        </div>

        {/* Icons */}
        <div className="flex space-x-4 items-center">
          <FiHeart className="w-5 h-5 cursor-pointer hover:text-green-400" />
          <FiShoppingCart className="w-5 h-5 cursor-pointer hover:text-green-400" />
          <FiUser className="w-5 h-5 cursor-pointer hover:text-green-400" />
        </div>
      </div>
    </header>
  );
}
