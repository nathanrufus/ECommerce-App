'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';

// ✅ Define types
type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  media_files?: { file_url: string }[];
  tags?: { _id: string; name: string }[];
};

type Brand = {
  _id: string;
  name: string;
  slug: string;
};

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();

  const initialQuery = params.get('q') || '';
  const [q, setQ] = useState<string>(initialQuery);
  const [brand, setBrand] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Fetch brands
  useEffect(() => {
    fetch('/api/brands')
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        const data = await res.json();
        setBrands(Array.isArray(data) ? data : []);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Failed to load brands:', message);
        setBrands([]);
      });
  }, []);

  // ✅ Fetch products with filters
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/filter/products', window.location.origin);
      if (q.trim()) url.searchParams.set('q', q.trim());
      if (brand) url.searchParams.set('brand', brand);
      if (minPrice) url.searchParams.set('minPrice', minPrice);
      if (maxPrice) url.searchParams.set('maxPrice', maxPrice);

      const res = await fetch(url.toString());

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Product fetch failed:', message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refetch when filters change
  useEffect(() => {
    fetchFilteredProducts();
  }, [q, brand, minPrice, maxPrice]);

  // ✅ Update query string on search submit
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-black mb-4">Search & Filter Products</h1>

      {/* 🔍 Filters */}
      <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b._id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />

        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />
      </form>

      {/* 🔄 Loading */}
      {loading && <p className="text-gray-500">Loading products...</p>}

      {/* 📦 No results */}
      {!loading && products.length === 0 && (
        <p className="text-gray-600">No products found.</p>
      )}

      {/* 🛍 Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
