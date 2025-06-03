'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // adjust path if needed

type OrderItem = {
  product_id: { name: string };
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  customer_id: { name: string; email: string };
  status: string;
  total_amount: number;
  shipping_address: string;
  order_date: string;
  items: OrderItem[];
};

const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetailsModal({
  order,
  onClose,
  onStatusChange, // ✅ callback to parent
}: {
  order: Order;
  onClose: () => void;
  onStatusChange?: (newStatus: string) => void;
}) {
  const { token } = useAuth();
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleStatusUpdate = async (newStatus: string) => {
    if (!token) {
      setMessage('❌ Unauthorized: No token found.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${order._id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update status');
      }

      setStatus(newStatus);
      setMessage('✅ Status updated successfully.');
      if (onStatusChange) onStatusChange(newStatus); // ✅ notify parent
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-sm"
            aria-label="Close order details"
          >
            Close
          </button>
        </div>

        <div className="space-y-2 text-sm">
          <div><strong>Customer:</strong> {order.customer_id?.name}</div>
          <div><strong>Email:</strong> {order.customer_id?.email}</div>
          <div><strong>Shipping Address:</strong> {order.shipping_address}</div>
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <select
              value={status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={loading}
              className="border rounded px-2 py-1 text-sm"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div><strong>Total:</strong> KES {order.total_amount.toLocaleString()}</div>
          <div><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</div>
        </div>

        <hr className="my-4" />

        <h3 className="font-semibold mb-2">Items</h3>
        <ul className="space-y-1 max-h-60 overflow-y-auto">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm border-b py-1">
              <span>{item.product_id?.name || 'Unnamed Product'}</span>
              <span>
                {item.quantity} × KES {item.price.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>

        {message && (
          <p className={`mt-4 text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
