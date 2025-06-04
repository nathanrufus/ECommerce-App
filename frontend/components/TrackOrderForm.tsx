'use client';

import { useState } from 'react';

type Product = {
  name: string;
  price: number;
};

type OrderItem = {
  product_id: Product;
  quantity: number;
  price: number;
};

type Order = {
  order_number: string;
  status: string;
  total: number;
  placed_at: string;
  shipping_address: string;
  items: OrderItem[];
};

export default function TrackOrderForm() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/track/${orderId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setOrder({
        order_number: data._id,
        status: data.status,
        total: data.total_amount, 
        placed_at: data.placed_at,
        shipping_address: data.shipping_address,
        items: data.items,
        });

    } catch (err: any) {
      setError(err.message || 'Failed to track order');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      />
      <button
        onClick={handleTrack}
        className="bg-[#1B1D30] text-white px-4 py-2 rounded-md hover:bg-[#70B244]"
      >
        Track Order
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {order && (
        <div className="bg-gray-50 border p-4 rounded-lg mt-4 shadow-sm">
          <p><strong>Order ID:</strong> {order.order_number}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> KES {order.total.toFixed(2)}</p>
          <p><strong>Shipping:</strong> {order.shipping_address}</p>
          <p><strong>Placed:</strong> {new Date(order.placed_at).toLocaleString()}</p>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Items:</h4>
            <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.product_id?.name} — {item.quantity} × KES {item.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
