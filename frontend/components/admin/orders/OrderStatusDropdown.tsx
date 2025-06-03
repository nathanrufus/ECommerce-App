'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled'];

export default function OrderStatusDropdown({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);

  const updateStatus = async (newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();
      setStatus(newStatus);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value)}
      className="border px-2 py-1 rounded text-sm bg-white text-black"
    >
      {statusOptions.map(opt => (
        <option key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  );
}
