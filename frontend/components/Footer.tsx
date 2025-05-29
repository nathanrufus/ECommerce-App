import Link from "next/link";
import { Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F3F4F6] text-[#4B5563] py-10 text-sm mt-16">
      <div className="max-w-6xl mx-auto px-6 flex md:flex-row justify-between items-center gap-6">
        {/* Important Links */}
        <div className="text-center md:text-left space-y-2">
          <p className="font-semibold text-[#1B1D30]">Quick Links</p>
          <div className="flex md:flex-row space-x-6 space-y-2 md:space-y-0">
            <Link href="/products" className="hover:underline">Shop</Link>
            <Link href="/explore" className="hover:underline">Explore</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center space-x-6">
          <a href="mailto:support@kwalas.tech" className="hover:text-[#1B1D30]" aria-label="Email">
            <Mail size={18} />
          </a>
          <a href="https://twitter.com" className="hover:text-[#1B1D30]" aria-label="Twitter">
            <Twitter size={18} />
          </a>
          <a href="https://instagram.com" className="hover:text-[#1B1D30]" aria-label="Instagram">
            <Instagram size={18} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Kwalas Tech. All rights reserved.
      </div>
    </footer>
  );
}
