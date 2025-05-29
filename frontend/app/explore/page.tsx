"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description?: string;
  short_desc?: string;
  meta_title?: string;
  meta_description?: string;
  MediaFiles?: { file_url: string }[];
  category: {
    id: number;
    name: string;
  };
};

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseURL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Group products by category name
  const grouped = products.reduce((acc, product) => {
    const category = product.category?.name || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const matchesSearch = (product: Product) => {
    const q = search.toLowerCase();
    return (
      product.name?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q) ||
      product.short_desc?.toLowerCase().includes(q) ||
      product.meta_title?.toLowerCase().includes(q) ||
      product.meta_description?.toLowerCase().includes(q)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1B1D30] mb-3">Explore Our Products</h1>
        <p className="text-gray-500 mb-6">Find the perfect items that fit your needs.</p>

        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 rounded-md border border-gray-300 text-sm w-full max-w-md mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grouped Products by Category */}
      {Object.entries(grouped).map(([categoryName, items]) => {
        const filtered = search
          ? items.filter(matchesSearch)
          : items;

        if (filtered.length === 0) return null;

        return (
          <div key={categoryName} className="mb-16">
            <h3 className="text-2xl font-bold text-[#1B1D30] mb-4">{categoryName}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <Link
                  href={`/products/${product.slug}`}
                  key={product.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:scale-[1.01] transition-transform relative"
                >
                  <Image
                    src={
                      product.MediaFiles?.[0]?.file_url || "/image.webp"
                    }
                    alt={product.name}
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full h-40 mb-3"
                    unoptimized
                  />
                  <h4 className="text-sm font-medium text-[#1B1D30] mb-1">
                    {product.name}
                  </h4>
                  <p className="text-base text-[#1B1D30] font-semibold">
                    ${product.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <h3 className="text-xl font-bold text-[#1B1D30] mb-2">Find Your Perfect Product</h3>
          <p className="text-sm text-gray-600">
            Whether you're shopping for tech, fashion, or essentials, we've got what you need.
          </p>
        </div>
        <div className="flex gap-4 items-start border rounded-lg p-4 bg-gray-50">
          <Image src="/feature-icon.png" alt="Feature" width={40} height={40} />
          <div>
            <h4 className="font-semibold text-[#1B1D30]">Top Features to Consider</h4>
            <p className="text-sm text-gray-600">
              Look for durability, value, and performance when shopping at Kwalas Tech.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
