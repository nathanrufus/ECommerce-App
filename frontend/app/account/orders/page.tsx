"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

type OrderItem = {
  product_id: number
  quantity: number
  price: number
}

type Order = {
  id: number
  order_date: string
  total_amount: number
  status: string
  shipping_address: string
  OrderItems: OrderItem[]
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("You must be logged in to view your orders")
      router.push("/login")
      return
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) throw new Error("Failed to fetch orders")

        const data = await res.json()
        setOrders(data)
      } catch (err) {
        toast.error("Unable to load orders")
        console.error(err)
      }
    }

    fetchOrders()
  }, [router])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1B1D30] mb-6">
        Your Orders
      </h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <p className="text-sm mb-1 text-gray-600">
                Order ID: <strong>#{order.id}</strong> | Placed:{" "}
                {new Date(order.order_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">Status: {order.status}</p>
              <ul className="mt-2 text-sm text-gray-800">
                {order.OrderItems.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>Product ID: {item.product_id} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-right font-semibold">
                Total: ${order.total_amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
