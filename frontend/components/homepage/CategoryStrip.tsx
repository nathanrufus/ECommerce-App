'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Category = {
  _id: string;
  name: string;
  slug: string;
  thumbnail_url?: string;
};

export default function CategoryStrip() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
        const data = await res.json();
        setCategories(data.categories || data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="bg-[#F8FAF8] dark:bg-[#121423] py-5">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat.slug}`}
              className="flex-shrink-0 w-36 bg-white dark:bg-[#1B1D30] rounded-lg shadow-sm hover:shadow-lg transition p-3 text-center border border-gray-200 dark:border-gray-700 hover:border-[#70B244]"
            >
              <Image
                src={cat.thumbnail_url || '/placeholder.jpg'}
                alt={cat.name}
                width={100}
                height={80}
                loading="lazy"
                className="mx-auto mb-2 rounded-md object-cover aspect-[5/4]"
              />
              <p className="text-sm font-medium text-[#1B1D30] dark:text-white truncate">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
