'use client';

import React from 'react';

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
  order_date: string;
  items: OrderItem[];
};

export default function OrderRow({
  order,
  onView,
  onDelete,
}: {
  order: Order;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <tr>
      <td className="px-4 py-2">{order._id}</td>
      <td className="px-4 py-2">KES {order.total_amount.toLocaleString()}</td>
      <td className="px-4 py-2">{order.status}</td>
      <td className="px-4 py-2">{new Date(order.order_date).toLocaleDateString()}</td>
      <td className="px-4 py-2 flex gap-2">
        <button
          onClick={onView}
          className="text-blue-600 hover:underline text-sm"
        >
          View
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:underline text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
