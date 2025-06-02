'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroBanner() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="bg-gray-100 py-6 mt-7">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-semibold text-black mb-2">
          What are you looking for?
        </h1>
        <form
          onSubmit={handleSearch}
          className="flex items-center justify-center gap-2 mt-3"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Laptop, Charger, SSD..."
            className="w-full sm:w-[320px] px-3 py-2 text-sm rounded-md border border-gray-300 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 text-sm rounded-md hover:bg-green-700 transition"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
