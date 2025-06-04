'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { useSearchParams, useRouter } from 'next/navigation';

interface Tag {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  media_files: { file_url: string }[];
  tags?: Tag[];
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/brands`);
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error('Failed to fetch brands', err);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/filter/products?${params.toString()}`
      );
      const data = await res.json();

      // ✅ Defensive check to ensure it's an array
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.error('Failed to fetch filtered products:', err);
      setProducts([]); // fallback on error
    } finally {
      setLoading(false);
    }
  };

  fetchFilteredProducts();
}, [category, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    if (filters.brand) query.append('brand', filters.brand);
    if (filters.minPrice) query.append('minPrice', filters.minPrice);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
    router.push(`/products?${query.toString()}`);
  };

  const handleResetFilters = () => {
    setFilters({ brand: '', minPrice: '', maxPrice: '' });
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    router.push(`/products?${query.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-2xl font-bold text-[#1B1D30] mb-6">
        {category ? `Products in ${category}` : 'All Products'}
      </h1>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-10 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-[#1B1D30] mb-4 text-center">Filter Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand.slug}>
                  {brand.name}
                </option>

              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              placeholder="10000"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleApplyFilters}
            className="bg-[#1B1D30] text-white px-6 py-2 rounded-md text-sm hover:bg-[#70B244]"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="text-sm text-[#1B1D30] underline hover:text-[#70B244]"
          >
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-20">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No products match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
