'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useCartStore from '@/store/cartStore';
import useWishlistStore from '@/store/wishlistStore';

export default function WishlistView() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, loadWishlist, clearWishlist } = useWishlistStore();
  const { addToCart, clearCart } = useCartStore();

  useEffect(() => {
    loadWishlist(); // Load from localStorage
  }, [loadWishlist]);

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (item: typeof wishlist[number]) => {
    addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1 });
    toast.success('Added to cart');
  };

  const handleBuyNow = (item: typeof wishlist[number]) => {
    clearCart();
    addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1 });
    router.push('/checkout');
  };

  if (wishlist.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600">
        <p className="text-lg">Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-16 px-4 pb-16">
      <h1 className="text-2xl font-semibold text-[#1B1D30] mb-6">My Wishlist</h1>

      {wishlist.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg p-4 mb-6 flex items-center gap-4 shadow-sm hover:shadow-md transition"
        >
          <Image
            src={item.image || '/placeholder.jpg'}
            alt={item.name}
            width={90}
            height={90}
            className="rounded-lg object-cover"
          />

          <div className="flex-1">
            <h2 className="text-base font-medium text-[#1B1D30] mb-1">{item.name}</h2>
            <p className="text-sm text-gray-500 mb-3">KES {item.price.toLocaleString()}</p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleAddToCart(item)}
                className="px-4 py-1.5 text-sm rounded-md bg-[#70B244] text-white hover:bg-[#5da239] transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow(item)}
                className="px-4 py-1.5 text-sm rounded-md bg-blue-950 text-white hover:bg-blue-900 transition"
              >
                Buy Now
              </button>
            </div>
          </div>

          <button
            onClick={() => handleRemove(item.id)}
            className="text-red-500 hover:text-red-700 transition"
            aria-label="Remove from wishlist"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
