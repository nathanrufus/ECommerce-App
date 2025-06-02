'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  media_files: { file_url: string }[];
};

export default function CategorySection({ category }: { category: Category }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products?category=${category.slug}`)
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 4)));
  }, [category.slug]);

  return (
    <section className="py-10 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">{category.name}</h2>
          <Link
            href={`/products?category=${category.slug}`}
            className="text-sm text-green-600 hover:underline"
          >
            See All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
