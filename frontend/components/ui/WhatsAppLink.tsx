'use client';

import { FaWhatsapp } from 'react-icons/fa';

type Props = {
  name: string;
  price: number;
  url?: string;
  className?: string;
};

export default function WhatsAppLink({ name, price, url = '', className = '' }: Props) {
  const message = `Hi! I'm interested in:\n${name}\nPrice: KES ${price.toLocaleString()}\n${url}`;
  const link = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-xs text-green-600 hover:underline ${className}`}
    >
      <FaWhatsapp className="w-4 h-4" />
      
    </a>
  );
}
