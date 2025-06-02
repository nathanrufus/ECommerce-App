// components/layout/Footer.tsx
import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-2">Contact Us</h3>
          <p>Email: info@kwalacomputers.co.ke</p>
          <p>Phone: 0708 600 025</p>
          <p>WhatsApp: Available</p>
        </div>

        {/* Helpful Links */}
        <div>
          <h3 className="text-white font-semibold mb-2">Help & Info</h3>
          <ul className="space-y-1">
            <li>Return Policy</li>
            <li>Warranty Claim</li>
            <li>Track Order</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <FaFacebook className="hover:text-green-500 cursor-pointer" />
            <FaInstagram className="hover:text-green-500 cursor-pointer" />
            <FaTwitter className="hover:text-green-500 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} Kwalas Computer. All rights reserved.
      </div>
    </footer>
  );
}
