
import React from 'react';

type OrderSummaryProps = {
  subtotal: number;
  onCheckout: () => void;
};

const SHIPPING_COST = 5.0;

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, onCheckout }) => {
  const total = subtotal + SHIPPING_COST;

  return (
    <div className="border rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
      <p className="text-gray-600 mb-4">Finalize your order details</p>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>🧾 Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>🚚 Shipping</span>
          <span>$5.00</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-4">
          <span>🛒 Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full mt-6 bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
