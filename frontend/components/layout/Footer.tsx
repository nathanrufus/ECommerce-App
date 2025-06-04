'use client';
import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-sm">
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
            <li>
              <Link href="/return-policy" className="hover:text-green-500 transition">
                Return Policy
              </Link>
            </li>
            <li>
              <Link href="/warranty" className="hover:text-green-500 transition">
                Warranty Claim
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:text-green-500 transition">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-green-500 transition">
                FAQs / Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="hover:text-green-500 transition cursor-pointer" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-green-500 transition cursor-pointer" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-green-500 transition cursor-pointer" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} Kwalas Computers. All rights reserved.
      </div>
    </footer>
  );
}
