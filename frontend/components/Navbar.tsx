"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#70B244] text-white px-6 py-4 shadow-md backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto relative">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/kwala.png"
            alt="Kwalas Logo"
            width={40}
            height={40}
            className="rounded-full bg-white p-1"
          />
          <span className="text-xl font-bold tracking-wide">Kwalas Tech</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/products" className="hover:underline">Shop</Link>
          <Link href="/explore" className="hover:underline">Explore</Link>
          <Link href="/cart" className="hover:underline">Cart</Link>
          <Link href="/login" className="hover:bg-white hover:text-[#70B244] px-3 py-1 rounded transition">Login</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav Menu - Absolute Dropdown */}
        {open && (
          <div className="absolute top-full right-0 mt-2 w-full bg-[#70B244] text-white rounded-md shadow-md flex flex-col py-3 space-y-2 md:hidden z-50">
            <Link href="/products" className="px-6 py-2 hover:bg-white/10">Shop</Link>
            <Link href="/explore" className="px-6 py-2 hover:bg-white/10">Explore</Link>
            <Link href="/cart" className="px-6 py-2 hover:bg-white/10">Cart</Link>
            <Link href="/login" className="px-6 py-2 hover:bg-white text-[#70B244] bg-white rounded-md mx-6 text-center">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
