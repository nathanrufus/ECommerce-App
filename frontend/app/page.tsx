'use client';
import React, { useEffect, useState } from 'react';
import HeroBanner from '@/components/homepage/HeroBanner';
import InfoStrip from '@/components/homepage/InfoStrip';
import CategorySection from '@/components/homepage/CategorySection';
import CategoryStrip from '@/components/homepage/CategoryStrip';


type Category = {
  _id: string;
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

export default function HomePage() {
  const [categoryBlocks, setCategoryBlocks] = useState<
    { category: Category; products: Product[] }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
      const categories = await res.json();

      const blocks = await Promise.all(
        categories.map(async (cat: Category) => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/category/${cat.slug}`);
          const products = await res.json();
          return { category: cat, products: products.slice(0, 8) };
        })
      );

      setCategoryBlocks(blocks);
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      <HeroBanner />
      <CategoryStrip />
      {categoryBlocks.map(({ category, products }) => (
        <CategorySection key={category._id} category={category} products={products} />
      ))}
      <InfoStrip />
    </main>
  );
}

