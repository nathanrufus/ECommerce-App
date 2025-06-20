'use client';
import React from 'react';
import WhatsAppLink from '@/components/ui/WhatsAppLink';
import useCartStore from '@/store/cartStore';

type OrderSummaryProps = {
  subtotal: number;
  onCheckout: () => void;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, onCheckout }) => {
  const total = subtotal;
  const { cartItems } = useCartStore();

  // Generate full cart message
  const message = cartItems
    .map(item => ` ${item.name} - KES ${item.price.toLocaleString()} x ${item.quantity}`)
    .join('\n');

  const whatsappMessage = `Hi! I'd like to order the following items:\n\n${message}\n\nTotal: KES ${total.toLocaleString()}`;

  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-md bg-white">
      <h2 className="text-xl font-semibold text-[#1B1D30] mb-2">Order Summary</h2>
      <p className="text-gray-600 mb-4">Finalize your order details</p>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>🧾 Subtotal</span>
          <span>KES {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold border-t pt-4">
          <span>🛒 Total</span>
          <span>KES {total.toFixed(2)}</span>
        </div>

        <button
          onClick={onCheckout}
          className="w-full mt-6 bg-[#70B244] text-white py-2 px-4 rounded-md font-medium hover:bg-[#5da239] transition"
        >
          Proceed to Checkout
        </button>

        {/* ✅ Order via WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-3 inline-block text-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium transition"
        >
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
};

export default OrderSummary;
