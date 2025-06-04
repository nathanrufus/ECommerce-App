'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBox() {
  const [q, setQ] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md mx-auto mt-10 py-4">
      <input
        type="text"
        placeholder="Search products..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-r-md hover:bg-green-700"
      >
        Search
      </button>
    </form>
  );
}
