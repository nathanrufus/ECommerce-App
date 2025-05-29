"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  media_files: { file_url: string }[];
};

type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Error loading categories");
    }
  };

  fetchCategories();
}, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.slice(0, 8)); 
      } catch (err: any) {
        setError(err.message || "Error loading products");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-15">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-left max-w-xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1B1D30] mb-6">
              Discover Technology<br className="hidden md:inline" /> That Works for You
            </h1>
            <p className="text-lg text-gray-600 mb-5">
              Your one-stop destination for the latest devices, trusted brands, and smart solutions — all in one place.
            </p>
            <ul className="list-disc list-inside text-gray-500 space-y-2 mb-8 text-sm">
              <li>Handpicked gadgets that blend style with performance</li>
              <li>Expert-curated deals tailored to your lifestyle</li>
              <li>A seamless and secure shopping experience</li>
            </ul>
            <Link
              href="/products"
              className="inline-block bg-[#70B244] text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-[#5A9C38] transition"
            >
              Shop Now
            </Link>
          </div>

          <div className="w-full md:w-[400px] lg:w-[460px]">
            <Image
              src="/herobann.jpg"
              alt="Tech Gadgets Display"
              width={460}
              height={460}
              className="rounded-2xl object-cover shadow-md"
              priority
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
           {/* Categories Section */}
           <section className="bg-[#F9FAFB] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 text-center text-[#1B1D30]">
            Shop by Category
          </h2>

          {error && (
            <p className="text-center text-red-500 text-sm mb-6">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="bg-[#FFFFFF] rounded-xl shadow-sm hover:shadow-lg p-4 flex flex-col items-center transition text-center"
              >
                <Image
                  src={`/categories/${cat.slug}.jpg`}
                  alt={cat.slug}
                  width={200}
                  height={100}
                  className="rounded-sm mb-4 object-cover"
                />
                <p className="font-medium text-[#1B1D30]">{cat.name}</p>
                <p className="text-xs text-gray-500">
                  {cat.description || "Explore great tech deals"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Newsletter Section */}
      <section className="bg-[#FFFFFF] py-10">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#1B1D30]">
              Subscribe to our Newsletter
            </h2>
            <p className="text-gray-600 mb-2">
              Be the first to hear about exclusive deals, new arrivals, and tech tips.
            </p>
            <p className="text-xs text-gray-400">
              We respect your privacy. No spam, ever.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row items-center gap-4 justify-end">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 px-4 py-2 rounded-md w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-[#70B244] text-white px-6 py-2 rounded-md hover:bg-[#5A9C38] transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-[#F9FAFB] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 text-center text-[#1B1D30]">
            Featured Products
          </h2>

          {error && (
            <p className="text-center text-sm text-red-500 mb-6">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#FFFFFF] rounded-xl shadow-sm hover:shadow-lg p-4 transition flex flex-col"
              >
                <Image
                  src={product.media_files?.[0]?.file_url || "/image.webp"}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="rounded-lg mb-4 object-cover"
                />
                <div className="flex-grow">
                  <p className="font-medium text-[#1B1D30] mb-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">High-quality, trusted choice</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    ${product.price}
                  </p>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-xs text-[#70B244] hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
