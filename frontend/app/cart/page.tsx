'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartItem from '@/components/CartItem';
import OrderSummary from '@/components/OrderSummary';
import useCartStore from '@/store/cartStore';

const CartPage = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeItem, subtotal, loadFromStorage } = useCartStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center min-h-screen">
        <h2 className="text-2xl font-semibold text-[#1B1D30] mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse products and add items to your cart.</p>
        <button
          onClick={() => router.push('/products')}
          className="px-5 py-2 bg-[#70B244] text-white rounded-md font-medium hover:bg-[#5da239] transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-[#1B1D30] mb-1">Your Shopping Cart</h1>
      <p className="text-gray-600 mb-8">
        Review your selected items before proceeding to checkout
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Cart Items */}
        <div>
          <h2 className="text-xl font-semibold text-[#1B1D30] mb-4">Cart Items</h2>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary subtotal={subtotal} onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
