import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import CartItem from '@/components/CartItem';
import OrderSummary from '@/components/OrderSummary';
import useCartStore from '@/store/cartStore'; 

const CartPage = () => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeItem, subtotal, loadFromStorage } = useCartStore();

  useEffect(() => {
    loadFromStorage(); // persist from localStorage on mount
  }, [loadFromStorage]);

  const handleQuantityChange = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: number) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600">Browse products and add items to your cart.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-2">Your Shopping Cart</h1>
      <p className="text-gray-600 mb-8">
        Review your selected items before proceeding to checkout
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Cart Table</h2>
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
        <div>
          <OrderSummary subtotal={subtotal} onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
