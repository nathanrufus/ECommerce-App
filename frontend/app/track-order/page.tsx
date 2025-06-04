import TrackOrderForm from '@/components/TrackOrderForm';

export default function TrackOrderPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1B1D30] mb-6">Track Your Order</h1>
      <TrackOrderForm />
    </div>
  );
}
