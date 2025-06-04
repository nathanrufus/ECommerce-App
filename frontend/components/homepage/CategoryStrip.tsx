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
    <section className="bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/products?category=${cat.slug}`}
              className="flex-shrink-0 bg-white rounded-md shadow-sm p-3 w-36 text-center hover:shadow-md transition"
            >
              <Image
                src={cat.thumbnail_url || '/placeholder.jpg'}
                alt={cat.name}
                width={100}
                height={80}
                className="mx-auto mb-2 object-cover rounded"
              />
              <p className="text-sm font-medium text-[#1B1D30]">{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
