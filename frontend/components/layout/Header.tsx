"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiHeart, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useWishlistStore from "@/store/wishlistStore"; // ✅ import wishlist store

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { cartItems } = useCartStore();
  const { wishlist, loadWishlist } = useWishlistStore();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    loadWishlist(); // ✅ load wishlist on mount
  }, [loadWishlist]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/kwala.png"
            alt="Kwalas Computer"
            width={36}
            height={36}
            className="rounded-full border-2 border-white shadow-sm"
          />
          <span className="text-lg font-semibold tracking-wide">
            Kwalas Computers
          </span>
        </Link>

        {/* Icons */}
        <div className="flex space-x-4 items-center relative">
          <div className="relative">
            <Link href="/wishlist" title={`Wishlist (${wishlistCount} items)`}>
              <FiHeart className="w-5 h-5 cursor-pointer hover:text-green-400" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            </Link>
          </div>

          <div className="relative">
            <Link href="/cart" title={`Cart (${cartCount} items)`}>
              <FiShoppingCart className="w-5 h-5 cursor-pointer hover:text-green-400" />
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </Link>
          </div>

          <div className="relative" ref={dropdownRef}>
            <FiUser
              className="w-5 h-5 cursor-pointer hover:text-green-400"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="Account"
            />

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-black rounded-md shadow-lg py-2 z-50">
                {!loading && user ? (
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
