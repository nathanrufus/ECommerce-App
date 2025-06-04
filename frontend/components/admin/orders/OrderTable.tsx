'use client';

import React, { useState, useEffect } from 'react';
import OrderRow from './OrderRow';
import OrderDetailsModal from './OrderDetailsModal';
import { useAuth } from '@/context/AuthContext';

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

const statuses = ['all', 'pending', 'shipped', 'delivered', 'cancelled'];

export default function OrderTable({ orders }: { orders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState('all');
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);

  const filtered = filter === 'all'
    ? localOrders
    : localOrders.filter(order => order.status === filter);

  const refreshOrders = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setLocalOrders(data);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-[#1B1D30] text-center md:text-left">All Orders</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm w-full md:w-auto"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <OrderRow
                key={order._id}
                order={order}
                onView={() => setSelectedOrder(order)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={() => {
            setSelectedOrder(null);
            refreshOrders();
          }}
        />
      )}
    </div>
  );
}
