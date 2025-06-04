'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type MediaFile = { file_url: string };

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock_quantity: number;
  media_files?: MediaFile[];
  tags?: { _id: string; name: string }[];
};

type Props = {
  product: Product;
  onDelete: (_id: string) => void;
};

export default function ProductCard({ product, onDelete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = product.media_files || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${product._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Delete failed");

      toast.success("Product deleted");
      onDelete(product._id);
    } catch (err) {
      toast.error("Could not delete product");
      console.error(err);
    }
  };

  const activeImage = images[currentIndex]?.file_url || "/placeholder.jpg";

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 relative border border-gray-200">
      
      {/* Optional Tag Pills */}
      {Array.isArray(product.tags) && product.tags.length > 0 && (
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
          {product.tags.map((tag) => (
            <span
              key={tag._id}
              className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Image Carousel */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3">
        <Image
          key={activeImage}
          src={activeImage}
          alt={product.name}
          fill
          unoptimized
          loading="lazy"
          onError={() => console.log("Failed to load image:", activeImage)}
          className="object-cover rounded-md transition-opacity duration-500"
        />

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex ? "bg-green-600" : "bg-gray-300"
                } transition-all duration-300`}
              ></span>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="font-medium text-sm text-[#1B1D30] truncate mb-1">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 mb-1">
        ${Number(product.price).toFixed(2)}
      </p>
      <p
        className={`text-xs font-medium ${
          product.stock_quantity > 0 ? "text-green-600" : "text-red-500"
        }`}
      >
        {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-3">
        <Link
          href={`/admin/products/${product._id}`}
          className="text-xs text-blue-600 hover:underline"
        >
          ✏️ Edit
        </Link>
        <button
          onClick={handleDelete}
          className="text-xs text-red-500 hover:underline"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
