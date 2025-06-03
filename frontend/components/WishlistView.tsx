'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
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
    return <p className="text-center mt-16">Your wishlist is empty.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 h-screen">
      <h1 className="text-2xl font-semibold mb-4">My Wishlist</h1>
      {wishlist.map((item) => (
        <div key={item.id} className="border rounded p-4 mb-4 flex gap-4 items-center">
          <Image
            src={item.image || '/placeholder.jpg'}
            alt={item.name}
            width={80}
            height={80}
            className="rounded object-cover"
          />
          <div className="flex-1">
            <h2 className="font-medium">{item.name}</h2>
            <p className="text-sm text-gray-600">KES {item.price}</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleAddToCart(item)}
                className="text-sm text-green-600 hover:underline"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow(item)}
                className="text-sm text-blue-600 hover:underline"
              >
                Buy Now
              </button>
            </div>
          </div>
          <button
            onClick={() => handleRemove(item.id)}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
    </div>
  );
}
