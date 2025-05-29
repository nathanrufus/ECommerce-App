"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#70B244] text-white px-6 py-4 shadow-md backdrop-blur-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
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
      </div>

      {/* Mobile Nav Menu */}
      {open && (
        <div className="flex flex-col mt-4 space-y-3 md:hidden text-sm font-medium">
          <Link href="/products" className="hover:underline">Shop</Link>
          <Link href="/explore" className="hover:underline">Explore</Link>
          <Link href="/cart" className="hover:underline">Cart</Link>
          <Link href="/login" className="hover:bg-white hover:text-[#70B244] px-3 py-1 rounded transition">Login</Link>
        </div>
      )}
    </nav>
  );
}
