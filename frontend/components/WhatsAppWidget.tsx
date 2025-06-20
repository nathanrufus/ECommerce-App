'use client';

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function WhatsAppWidget() {
  const [showHelpBubble, setShowHelpBubble] = useState(true);

  return (
    <>
      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
          "Hi! I need help with a product on Kwalas Tech."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-50 transition"
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>
        {showHelpBubble && (
<div className="fixed bottom-24 right-4 sm:right-6 w-[90%] sm:max-w-sm bg-green-50 border border-green-200 rounded-xl shadow-xl p-4 z-50 animate-fadeIn text-sm text-green-900">
            <button
            onClick={() => setShowHelpBubble(false)}
            className="absolute top-2 right-2 text-green-500 hover:text-red-500"
            aria-label="Close"
            >
            <IoClose className="w-5 h-5" />
            </button>

            <p className="text-sm font-semibold mb-1 flex items-center gap-2">
            <FaWhatsapp className="text-green-600 w-4 h-4" />
            <span>Kwalas Tech</span>
            </p>

            <ul className="text-xs space-y-1 mt-2 pl-4 list-disc">
            <li><span className="font-medium">📍 Location:</span> Nairobi & Nakuru</li>
            <li><span className="font-medium">🕒 Hours:</span> Mon–Sat: 8AM–6PM</li>
            <li><span className="font-medium">❌ Closed:</span> Sunday</li>
            </ul>

            <p className="mt-3 text-xs text-gray-700 leading-relaxed">
            🛒 To shop, just click the WhatsApp icon, and it will automatically include the product information in your message.
            You’ll be assisted immediately via WhatsApp.
            </p>
        </div>
        )}

    </>
  );
}
