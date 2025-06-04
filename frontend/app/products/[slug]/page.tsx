"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useCartStore from "@/store/cartStore";
import { toast } from "react-hot-toast";
import ReviewForm from "@/components/ReviewForm";
import ProductCard from "@/components/ui/ProductCard";


type MediaFile = { file_url: string };

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  media_files?: MediaFile[];
};

type Review = {
  _id: string;
  name: string;
  comment: string;
  rating: number;
};

type Related = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  media_files?: MediaFile[];
};

export default function ProductDetailsPage() {
  const { addToCart } = useCartStore();
  const { slug } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Related[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      const res = await fetch(`${baseURL}/products/${slug}`);
      const data = await res.json();
      setProduct(data.product);
      setReviews(data.reviews || []);
      setRelated(data.related || []);
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (!product?.media_files || product.media_files.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        (prev + 1) % product.media_files!.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [product?.media_files]);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!product) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
    });
    toast.success("Added to cart");
  };

  if (!product) {
    return (
      <div className="text-center py-20 h-screen mt-40">
        Loading product...
      </div>
    );
  }

  const currentImage =
    product.media_files?.[currentImageIndex]?.file_url || "/image.webp";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-block mb-6 px-4 py-2 bg-[#1B1D30] text-white text-sm rounded hover:bg-[#70B244] transition"
      >
        ← Back to Products
      </Link>

      <h1 className="text-3xl font-bold text-[#1B1D30] mb-2">Product Details</h1>
      <p className="text-gray-600 mb-8">
        Discover more about this amazing product.
      </p>

      {/* Product Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image Carousel */}
        <div>
          <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
           <Image
            key={currentImage}
            src={currentImage}
            alt={product.name}
            fill
            unoptimized
            loading="lazy" // <--- Lazy loading applied here
            className="object-contain transition-opacity duration-700 ease-in-out"
          />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#1B1D30]">
            {product.name}
          </h2>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-lg font-bold text-[#1B1D30]">
            ${product.price.toFixed(2)}
          </p>
          <p
            className={`text-sm font-medium ${
              product.stock_quantity > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="qty" className="text-sm font-medium">
              Select Quantity
            </label>
            <input
              type="number"
              id="qty"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border border-gray-300 px-2 py-1 rounded-md text-sm"
            />
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity < 1}
            type="button"
            className="mt-4 px-6 py-2 rounded-md bg-[#1B1D30] hover:bg-[#70B244] text-white transition disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6 text-[#1B1D30]">
          Customer Reviews
        </h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500 mb-4">No reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-sm font-semibold text-[#1B1D30]">{rev.name}</p>
              <p className="text-sm text-gray-600">{rev.comment}</p>
              <p className="text-yellow-500 text-sm">{"★".repeat(rev.rating)}</p>
            </div>
          ))
        )}

        <ReviewForm
          productId={product._id}
          onSuccess={() => window.location.reload()}
        />
      </div>

      {/* Related Products */}
     {/* Related Products */}
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-[#1B1D30]">
        Related Products
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {related.map((rel) => (
          <div key={rel._id} className="min-w-[220px] flex-shrink-0">
            <ProductCard product={{ ...rel, media_files: rel.media_files || [] }} />
          </div>
        ))}
      </div>
    </div>

    </div>
  );
}
