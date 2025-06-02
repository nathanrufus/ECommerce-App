// components/homepage/NewsletterSignup.tsx
import React from 'react';

export default function NewsletterSignup() {
  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-semibold text-black mb-2">Subscribe to Our Newsletter</h2>
        <p className="text-sm text-gray-600 mb-4">No spam — only exclusive tech tips and deals.</p>
        <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-auto flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
