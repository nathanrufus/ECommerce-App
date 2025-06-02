'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  media_files: { file_url: string }[];
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col group relative">
      {/* Wishlist Icon (top-right corner) */}
      <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition">
        <FiHeart className="w-5 h-5" />
      </button>

      {/* Product Image */}
      <Image
        src={product.media_files?.[0]?.file_url || '/image.webp'}
        alt={product.name}
        width={300}
        height={200}
        className="rounded-lg mb-3 object-cover w-full h-48"
      />

      {/* Product Info */}
      <div className="flex-grow">
        <h3 className="font-medium text-black text-sm mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-xs mb-2">High-quality, trusted choice</p>
      </div>

      {/* Price + Actions */}
      <div className="flex justify-between items-center mt-auto">
        <p className="text-sm font-semibold text-gray-800">${product.price}</p>
        <div className="flex items-center space-x-3">
          <Link
            href={`/products/${product.slug}`}
            className="text-xs text-green-600 hover:underline"
          >
            View
          </Link>
          <button className="text-gray-500 hover:text-green-600 transition">
            <FiShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
