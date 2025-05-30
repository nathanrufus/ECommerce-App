"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

type OrderItem = {
  product_id: number
  quantity: number
  price: number
}

type Order = {
  id: number
  total_amount: number
  shipping_address: string
  status: string
  OrderItems: OrderItem[]
}

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("id")

  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("You must be logged in to view your order")
      router.push("/login")
      return
    }

    if (!orderId) return

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) throw new Error("Failed to fetch order")

        const data = await res.json()
        setOrder(data)
      } catch (err) {
        toast.error("Order not found or access denied")
        router.push("/")
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <p className="text-lg text-gray-600">Loading your order...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1B1D30] mb-2">
        Order Confirmed
      </h1>
      <p className="text-gray-600 mb-6">
        Your order has been placed successfully. Thank you!
      </p>

      <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm">
        <p className="text-sm">
          <span className="font-semibold">Order ID:</span> #{order.id}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Shipping Address:</span>{" "}
          {order.shipping_address}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Status:</span> {order.status}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-[#1B1D30]">
        Items in Your Order
      </h2>
      <div className="space-y-4">
        {order.OrderItems.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center border p-3 rounded bg-white"
          >
            <div>
              <p className="font-medium text-sm text-[#1B1D30]">
                Product ID: {item.product_id}
              </p>
              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between text-lg font-bold border-t pt-4">
        <span>Total Paid</span>
        <span>${order.total_amount.toFixed(2)}</span>
      </div>
    </div>
  )
}
