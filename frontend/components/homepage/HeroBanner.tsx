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
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-md mx-auto mt-10 py-4 px-2 sm:px-0"
    >
      <input
        type="text"
        placeholder="Search products..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1B1D30] text-[#1B1D30] dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#70B244] focus:outline-none transition"
      />
      <button
        type="submit"
        className="px-5 py-2 bg-[#70B244] text-white font-medium rounded-r-md hover:bg-[#5da239] transition"
      >
        Search
      </button>
    </form>
  );
}
