'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();

  const initialQuery = params.get('q') || '';
  const [q, setQ] = useState(initialQuery);
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch brand list once
  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error('Failed to load brands', err));
  }, []);

  // ✅ Unified search + filters using /api/filter/products
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/filter/products', window.location.origin);
      if (q.trim()) url.searchParams.set('q', q.trim());
      if (brand) url.searchParams.set('brand', brand);
      if (minPrice) url.searchParams.set('minPrice', minPrice);
      if (maxPrice) url.searchParams.set('maxPrice', maxPrice);

      const res = await fetch(url.toString());
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Product fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ React to filter changes
  useEffect(() => {
    fetchFilteredProducts();
  }, [q, brand, minPrice, maxPrice]);

  // ✅ Push q to URL on form submit (for bookmarking)
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-black mb-4">Search & Filter Products</h1>

      {/* 🔍 Search + Filters */}
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
          {brands.map((b: any) => (
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

      {loading && <p className="text-gray-500">Loading products...</p>}
      {!loading && products.length === 0 && (
        <p className="text-gray-600">No products found.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
