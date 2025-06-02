"use client";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock_quantity: number;
  media_files?: { file_url: string }[];
};

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.media_files?.[0]?.file_url || "/image.webp";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg p-4 transition block"
    >
      <div className="w-full h-40 relative mb-4">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-dark text-sm truncate">{product.name}</h3>
        <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
        <p
          className={`text-xs font-medium ${
            product.stock_quantity > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
        </p>
      </div>
    </Link>
  );
}
