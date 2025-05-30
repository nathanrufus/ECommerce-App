// app/checkout/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import useCartStore from "@/store/cartStore"
import CheckoutForm, { ShippingInfo } from "@/components/CheckoutForm"
import CartPreviewItem from "@/components/CartPreviewItem"

export default function CheckoutPage() {
  const { cartItems, subtotal } = useCartStore()
  const router = useRouter()

  const [form, setFormField] = useState<ShippingInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  })

  const setForm = (key: keyof ShippingInfo, value: string) => {
    setFormField(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("You must be logged in to place an order")
      return
    }

    const items = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));
      
      const shipping_address = `${form.address}, ${form.city}, ${form.zip}`;
      

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          shipping_address,
        }),
      })

      if (!res.ok) throw new Error("Failed to place order")

      const data = await res.json()
      toast.success("Order placed successfully!")

      useCartStore.getState().loadFromStorage() // if needed
      useCartStore.setState({ cartItems: [], subtotal: 0 })
      localStorage.removeItem("cart")
      router.push(`/confirm?id=${data.order.id}`)
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong while placing the order")
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1B1D30] mb-2">
        Complete Your Order
      </h1>
      <p className="text-gray-600 mb-8">
        Please fill in your details below to proceed with the order.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Shipping Form */}
        <div>
          <CheckoutForm form={form} setForm={setForm} />
          <button
            onClick={handleSubmit}
            className="mt-6 px-6 py-2 bg-[#1B1D30] hover:bg-[#70B244] text-white rounded-md"
          >
            Continue
          </button>
        </div>

        {/* Right: Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#1B1D30]">Your Order</h2>
          <p className="text-gray-600 mb-4">Review your selected items before proceeding to payment.</p>
          <div className="mb-4">
            {cartItems.map(item => (
              <CartPreviewItem
                key={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
              />
            ))}
          </div>
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
