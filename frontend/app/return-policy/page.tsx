export default function ReturnPolicyPage() {
  return (
    <section className="px-4 py-8 max-w-3xl mx-auto h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">Return Policy</h1>
      <p className="text-gray-600 mb-4">
        We want you to be completely satisfied with your purchase. If you're not happy for any reason, you may return most new, unopened items within 14 days of delivery for a full refund.
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Items must be returned in original condition and packaging.</li>
        <li>Return shipping costs are the responsibility of the customer unless the return is due to our error.</li>
        <li>Refunds will be processed within 7 business days after we receive the returned item.</li>
      </ul>
    </section>
  );
}
