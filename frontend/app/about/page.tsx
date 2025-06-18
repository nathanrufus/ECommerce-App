'use client';
import React from 'react';

export default function AboutPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 text-gray-800 min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
          About Kwalas Computers
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          Trusted by thousands, we deliver quality tech and honest service across Kenya and beyond.
        </p>
      </div>

      {/* Content Blocks */}
      <div className="space-y-10 text-sm leading-relaxed">
        {/* Who We Are */}
        <div>
          <h2 className="text-xl font-semibold text-green-700 mb-2">Who We Are</h2>
          <p>
            Kwalas Computers is a customer-first tech store dedicated to providing high-quality
            computers, accessories, and electronics at competitive prices. We're a locally rooted,
            digitally driven business with a passion for reliable service and transparent transactions.
          </p>
        </div>

        {/* What We Offer */}
        <div>
          <h2 className="text-xl font-semibold text-green-700 mb-2">What We Offer</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>🖥️ Laptops, desktops, printers, and accessories</li>
            <li>📦 Nationwide delivery and doorstep support</li>
            <li>🔒 Secure payments & verified warranties</li>
            <li>💬 Real-time customer support on WhatsApp & phone</li>
          </ul>
        </div>

        {/* Our Vision */}
        <div>
          <h2 className="text-xl font-semibold text-green-700 mb-2">Our Vision</h2>
          <p>
            To become Kenya’s most trusted online tech retailer — where quality, honesty, and service
            come first. We aim to bridge the gap between premium tech and accessible pricing for students,
            professionals, and businesses alike.
          </p>
        </div>

        {/* Why Choose Us */}
        <div>
          <h2 className="text-xl font-semibold text-green-700 mb-2">Why Choose Us?</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>✅ Transparent pricing — no hidden costs</li>
            <li>✅ Verified products with warranty support</li>
            <li>✅ Easy returns and clear refund policy</li>
            <li>✅ We’re real people — with a real phone number</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
