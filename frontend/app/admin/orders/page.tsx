// app/admin/orders/page.tsx
import OrderTable from '@/components/admin/orders/OrderTable';
import { cookies } from 'next/headers';

export default async function OrdersPage() {
const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value; 
  console.log('TOKEN:', token);


  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch orders');

  const orders = await res.json();

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      <h1 className="text-3xl font-bold text-black mb-6">Manage Orders</h1>
      <OrderTable orders={orders} />
    </div>
  );
}
