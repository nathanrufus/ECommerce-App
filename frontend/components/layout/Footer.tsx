'use client';
import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#1B1D30] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-2">Contact Us</h3>
          <p className="mb-1">Email: info@kwalacomputers.co.ke</p>
          <p className="mb-1">Phone: 0708 600 025</p>
          <p>WhatsApp: Available</p>
        </div>

        {/* Help & Info */}
        <div>
          <h3 className="text-white font-semibold mb-2">Help & Info</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/return-policy" className="hover:text-[#70B244] transition">
                Return Policy
              </Link>
            </li>
            <li>
              <Link href="/warranty" className="hover:text-[#70B244] transition">
                Warranty Claim
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:text-[#70B244] transition">
                Track Order
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-[#70B244] transition">
                FAQs / Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Visit Us */}
        <div>
          <h3 className="text-white font-semibold mb-2">Visit Us</h3>
          <div className="mb-2">
            <p className="font-medium text-white">Opening Hours</p>
            <p>Mon - Sat: 8:00 AM – 6:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">Our Locations</p>
            <p>📍 Nairobi</p>
            <p>📍 Nakuru</p>
          </div>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-white font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4 text-xl mt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[#70B244] transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-[#70B244] transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-[#70B244] transition"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-800">
        &copy; {new Date().getFullYear()} Kwalas Computers. All rights reserved.
      </div>
    </footer>
  );
}
