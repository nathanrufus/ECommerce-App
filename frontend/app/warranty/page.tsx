export default function WarrantyPage() {
  return (
    <section className="px-4 py-8 max-w-3xl mx-auto h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">Warranty Information</h1>
      <p className="text-gray-600 mb-4">
        All products sold by Kwalas Computers come with a standard 12-month limited warranty unless otherwise stated.
      </p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>The warranty covers manufacturing defects and hardware failures under normal usage.</li>
        <li>Damage due to misuse, accidents, or unauthorized modifications is not covered.</li>
        <li>Warranty claims require proof of purchase and may take up to 5 business days to process.</li>
      </ul>
    </section>
  );
}
