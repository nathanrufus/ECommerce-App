'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';

export type Brand = {
  _id: string;
  name: string;
  slug: string;
};
export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  media_files?: { file_url: string }[];
  tags?: { _id: string; name: string }[];
};

export default function ProductSearchFilterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  useEffect(() => {
    fetch('/api/brands')
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setBrands(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to load brands:', err);
        setBrands([]);
      });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.q) query.set('q', filters.q.trim());
        if (filters.brand) query.set('brand', filters.brand);
        if (filters.minPrice) query.set('minPrice', filters.minPrice);
        if (filters.maxPrice) query.set('maxPrice', filters.maxPrice);

        const res = await fetch(`/api/filter/products?${query.toString()}`);
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Product fetch failed:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (filters.q) query.set('q', filters.q.trim());
    if (filters.brand) query.set('brand', filters.brand);
    if (filters.minPrice) query.set('minPrice', filters.minPrice);
    if (filters.maxPrice) query.set('maxPrice', filters.maxPrice);
    router.push(`/search?${query.toString()}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-black mb-6">Search & Filter Products</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          value={filters.q}
          onChange={(e) => handleFilterChange('q', e.target.value)}
          placeholder="Search..."
          className="border border-gray-300 rounded-md px-4 py-2"
        />

        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand.slug}>
              {brand.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          placeholder="Min Price"
          className="border border-gray-300 rounded-md px-4 py-2"
        />

        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          placeholder="Max Price"
          className="border border-gray-300 rounded-md px-4 py-2"
        />
      </form>

      {loading && <p className="text-gray-500">Loading products...</p>}
      {!loading && products.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
