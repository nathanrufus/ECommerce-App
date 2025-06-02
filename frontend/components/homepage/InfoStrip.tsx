// components/homepage/InfoStrip.tsx
import React from 'react';
import { FaTruck, FaLock, FaHandshake } from 'react-icons/fa';

const items = [
  { icon: <FaTruck className="text-green-600" />, text: 'Fast Delivery' },
  { icon: <FaLock className="text-green-600" />, text: 'Secure Payments' },
  { icon: <FaHandshake className="text-green-600" />, text: 'Warranty Support' },
];

export default function InfoStrip() {
  return (
    <section className="bg-white py-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 flex justify-around items-center text-sm text-gray-700">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
