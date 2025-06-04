'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';

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
  const [adding, setAdding] = useState(false);
  const images = Array.isArray(product.media_files) ? product.media_files : [];
  const { addToCart } = useCartStore();

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loadWishlist,
  } = useWishlistStore();

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isWishlisted = isInWishlist(product._id);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.media_files?.[0]?.file_url || '/placeholder.jpg',
      });
      toast.success('Added to wishlist');
    }
  };

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images]);

  const activeImage = images[currentIndex]?.file_url || '/image.webp';

  const handleAddToCart = () => {
    if (adding) return;
    setAdding(true);
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
    sessionStorage.setItem('bounceCart', 'true');
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all p-5 flex flex-col group relative overflow-hidden min-h-[360px]">

      {/* Tags (top-left) */}
      {Array.isArray(product.tags) && product.tags.length > 0 && (
        <div className="absolute -top-1 -left-1 flex flex-wrap gap-1 z-10">
          {product.tags.map((tag, i) => (
            <span
              key={`${tag.name}-${i}`}
              className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Wishlist Icon (top-right) */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 transition z-10 ${
          isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        }`}
        title="Toggle wishlist"
      >
        <FiHeart className="w-5 h-5" />
      </button>

      {/* Product Image with Dots */}
      <div className="relative w-full h-56 mb-4 overflow-hidden rounded-lg bg-gray-100">
        <Image
          key={activeImage}
          src={activeImage}
          alt={product.name}
          fill
          unoptimized
          className="object-cover transition-opacity duration-700 ease-in-out"
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex ? 'bg-green-600' : 'bg-gray-300'
                } transition-all duration-300`}
              ></span>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <h3
          className="font-medium text-black text-sm mb-2 line-clamp-2"
          title={product.name}
        >
          {product.name}
        </h3>
      </div>

      {/* Price + Actions */}
      <div className="flex justify-between items-center mt-auto">
        <p className="text-sm font-semibold text-gray-800">
          KES {Number(product.price).toLocaleString()}
        </p>
        <div className="flex items-center space-x-3">
          <Link
            href={`/products/${product.slug}`}
            className="text-xs text-green-600 hover:underline"
          >
            View
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`text-gray-500 hover:text-green-600 transition ${
              adding ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Add to cart"
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
