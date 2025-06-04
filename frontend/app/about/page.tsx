export default function SupportPage() {
  return (
    <section className="px-4 py-8 max-w-3xl mx-auto h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">Customer Support</h1>
      <p className="text-gray-600 mb-4">
        Need help with a product or service? Our support team is here for you!
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>📧 Email us at: <a href="mailto:support@kwalascomputers.co.ke" className="text-green-600 underline">support@kwalascomputers.co.ke</a></li>
        <li>📞 Call us: 0708 600 025</li>
        <li>💬 Chat with us on WhatsApp (bottom right corner)</li>
      </ul>
    </section>
  );
}
