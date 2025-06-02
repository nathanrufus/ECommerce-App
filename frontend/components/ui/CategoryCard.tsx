// components/ui/CategoryCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export default function CategoryCard({ id, name, slug, description }: Props) {
  return (
    <Link
      href={`/products?category=${slug}`}
      className="flex-shrink-0 bg-white rounded-md shadow-sm hover:shadow-lg p-3 w-36 text-center transition"
    >
      <Image
        src={`/categories/${slug}.jpg`}
        alt={name}
        width={100}
        height={80}
        className="mx-auto mb-2 object-cover rounded"
      />
      <p className="text-sm font-medium text-black">{name}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </Link>
  );
}
