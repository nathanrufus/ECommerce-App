'use client';
import React, { useEffect, useState } from 'react';
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
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-green-600 rounded-md px-4 py-2 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-white text-sm sm:text-base">
          <h2 className="font-semibold">{category.name}</h2>
          <Link
            href={`/products?category=${category.slug}`}
            className="hover:underline hover:text-gray-100 transition text-sm"
          >
            See All →
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 w-max min-w-full">
            {products.map((product) => (
              <div
                key={product._id}
                className="min-w-[250px] max-w-[300px] flex-shrink-0"
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

