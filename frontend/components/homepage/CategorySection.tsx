'use client';
import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';

type Category = {
  name: string;
  slug: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  media_files: { file_url: string }[];
};

export default function CategorySection({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  return (
    <section className="py-3 bg-gray-300 dark:bg-[#121423]">
      <div className="max-w-7xl mx-auto bg-white pb-3">
        {/* Gradient Header Block */}
        <div className="bg-gradient-to-r from-[#70B244] to-[#1B1D30] rounded-md px-4 py-2 mb-4 flex justify-between text-white text-sm sm:text-base shadow-sm">
          <h2 className="font-semibold">{category.name}</h2>
          <Link
            href={`/products?category=${category.slug}`}
            className="hover:underline hover:text-gray-100 transition text-sm font-medium"
          >
            See All →
          </Link>
        </div>

        {/* Product Carousel */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 w-max min-w-full">
            {products.map((product) => (
              <div
                key={product._id}
                className="min-w-[250px] max-w-[300px] flex-shrink-0 bg-white dark:bg-[#1B1D30] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
