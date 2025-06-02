// app/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import HeroBanner from '@/components/homepage/HeroBanner';
import InfoStrip from '@/components/homepage/InfoStrip';
import NewsletterSignup from '@/components/homepage/NewsletterSignup';
import CategorySection from '@/components/homepage/CategorySection';
import CategoryStrip from '@/components/homepage/CategoryStrip';


type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      
      <HeroBanner />
      <CategoryStrip />
      {categories.map((cat) => (
       <CategorySection key={cat._id} category={cat} />
      ))}
      <InfoStrip />
      <NewsletterSignup />
      
    </main>
  );
}
