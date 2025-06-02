'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

type Product = {
  _id: string;
  name: string;
  price: number;
  slug: string;
  media_files: { file_url: string }[];
};

type Brand = {
  _id: string;
  name: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [imageIndexes, setImageIndexes] = useState<{ [id: string]: number }>({});
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
  });

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${baseURL}/brands`);
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error('Failed to load brands:', err);
      }
    };
    fetchBrands();
  }, [baseURL]);

  const fetchProducts = async (reset = true) => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.minPrice) query.append('minPrice', filters.minPrice);
      if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
      if (filters.brand) query.append('brand', filters.brand);
      query.append('page', page.toString());

      const res = await fetch(`${baseURL}/filter/products?${query.toString()}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setProducts([]);
        setHasMore(false);
        return;
      }

      const enrichedProducts = await Promise.all(
        data.map(async (product) => {
          if (product.media_files && product.media_files.length > 0) return product;
          const mediaRes = await fetch(`${baseURL}/products/${product._id}`);
          const mediaData = await mediaRes.json();
          return {
            ...product,
            media_files: mediaData.media_files || [],
          };
        })
      );

      const updatedIndexes: { [id: string]: number } = {};
      enrichedProducts.forEach((p) => {
        updatedIndexes[p._id] = 0;
      });

      if (reset) {
        setProducts(enrichedProducts);
        setImageIndexes(updatedIndexes);
      } else {
        setProducts((prev) => [...prev, ...enrichedProducts]);
        setImageIndexes((prev) => ({ ...prev, ...updatedIndexes }));
      }

      setHasMore(enrichedProducts.length > 0);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(true);
  }, [filters]);

  useEffect(() => {
    if (page > 1) fetchProducts(false);
  }, [page]);

  // Rotate images every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated: { [id: string]: number } = {};
        products.forEach((product) => {
          const images = product.media_files || [];
          if (images.length > 1) {
            const current = prev[product._id] || 0;
            updated[product._id] = (current + 1) % images.length;
          } else {
            updated[product._id] = 0;
          }
        });
        return updated;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [products]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pt-20">
      {/* ...filters code stays same... */}

      {/* Product Grid */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-semibold text-[#1B1D30] mb-6">Available Products</h2>

        {loading && products.length === 0 && (
          <div className="text-center py-10 text-gray-600">Loading products...</div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No products found. Try adjusting your filters.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const currentImage = product.media_files?.[imageIndexes[product._id] || 0]?.file_url || '/image.webp';
            return (
              <div
                key={product._id}
                className="relative bg-white rounded-xl shadow-sm hover:shadow-md p-4 transition flex flex-col overflow-hidden"
              >
                <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition z-10">
                  <FiHeart className="w-5 h-5" />
                </button>

                <div className="relative w-full h-48 mb-3 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    key={currentImage}
                    src={currentImage}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover transition-opacity duration-700 ease-in-out"
                  />
                </div>

                <h3 className="font-medium text-sm text-[#1B1D30] mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  KES {Number(product.price).toLocaleString()}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <Link href={`/products/${product.slug}`} className="text-xs text-green-600 hover:underline">
                    View
                  </Link>
                  <button className="text-gray-500 hover:text-green-600 transition">
                    <FiShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="bg-[#1B1D30] hover:bg-[#70B244] text-white px-6 py-2 rounded-md text-sm transition"
            >
              Load More
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
