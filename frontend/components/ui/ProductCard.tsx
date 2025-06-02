'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

type Tag = {
  _id: string;
  name: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  media_files: { file_url: string }[];
  tags?: Tag[];
};

export default function ProductCard({ product }: { product: Product }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = Array.isArray(product.media_files) ? product.media_files : [];

  useEffect(() => {
    if (images.length <= 1) {
      console.log(`[${product.name}] Only one or no image — skipping rotation.`);
      return;
    }

    console.log(`[${product.name}] Starting image rotation with ${images.length} images.`);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % images.length;
        console.log(`[${product.name}] Switching image: ${prev} → ${nextIndex}`);
        return nextIndex;
      });
    }, 2500);

    return () => {
      console.log(`[${product.name}] Clearing interval on unmount.`);
      clearInterval(interval);
    };
  }, [images, product.name]);

  const activeImage = images[currentIndex]?.file_url || '/image.webp';

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col group relative overflow-hidden">
      {/* Wishlist Icon */}
      <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition z-10">
        <FiHeart className="w-5 h-5" />
      </button>

      {/* Product Image */}
      <div className="relative w-full h-48 mb-3 overflow-hidden rounded-lg bg-gray-100">
        <Image
          key={activeImage}
          src={activeImage}
          alt={product.name}
          fill
          unoptimized
          onError={() => console.log(`[${product.name}] Failed to load image: ${activeImage}`)}
          className="object-cover transition-opacity duration-700 ease-in-out"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <h3 className="font-medium text-black text-sm mb-1 line-clamp-1">{product.name}</h3>
        {Array.isArray(product.tags) && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.tags.map((tag) => (
              <span
                key={tag._id || tag.name}
                className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price + Actions */}
      <div className="flex justify-between items-center mt-auto">
        <p className="text-sm font-semibold text-gray-800">
          KES {Number(product.price).toLocaleString()}
        </p>
        <div className="flex items-center space-x-3">
          <Link href={`/products/${product.slug}`} className="text-xs text-green-600 hover:underline">
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
