'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-4xl font-bold text-red-600 mb-4">500 - Something went wrong</h1>
        <p className="text-gray-600 mb-6">Please try again or reload the page.</p>
        <button
          onClick={() => reset()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
