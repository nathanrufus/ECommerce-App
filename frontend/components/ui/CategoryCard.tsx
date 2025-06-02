import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  _id: string;
  name: string;
  slug: string;
  thumbnail_url?: string;
};

export default function CategoryCard({ _id, name, slug, thumbnail_url }: Props) {
  return (
    <Link
      href={`/products?category=${slug}`}
      className="flex-shrink-0 bg-white rounded-md shadow-sm hover:shadow-lg p-3 w-36 text-center transition"
    >
      <Image
        src={thumbnail_url || '/placeholder.jpg'}
        alt={name}
        width={100}
        height={80}
        className="mx-auto mb-2 object-cover rounded"
      />
      <p className="text-sm font-medium text-black">{name}</p>
    </Link>
  );
}
