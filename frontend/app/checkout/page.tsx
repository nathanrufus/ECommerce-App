"use client"

import { useState } from "react"
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
  const [saveInfo, setSaveInfo] = useState(false)

  const setForm = (key: keyof ShippingInfo, value: string) => {
    setFormField(prev => ({ ...prev, [key]: value }))
  }

  const validateInputs = () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error("Name, email, and phone are required")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    if (!validateInputs()) return

    const items = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
    }))

    const shipping_address = `${form.address}, ${form.city}, ${form.zip}`

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shipping_address,
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to place order")

      toast.success("Order placed successfully!")
      useCartStore.getState().loadFromStorage()
      useCartStore.setState({ cartItems: [], subtotal: 0 })
      localStorage.removeItem("cart")

      if (saveInfo) {
        localStorage.setItem("guestInfo", JSON.stringify(form))
      }

      router.push(`/confirm?id=${data.order._id}`)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Something went wrong while placing the order")
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-12 bg-gray-50 min-h-screen ">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1D30] mb-3">Complete Your Order</h1>
      <p className="text-gray-600 text-sm sm:text-base mb-6">
        Please fill in your details to proceed.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <CheckoutForm form={form} setForm={setForm} />
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="saveInfo"
              checked={saveInfo}
              onChange={() => setSaveInfo(prev => !prev)}
              className="w-4 h-4 text-[#1B1D30]"
            />
            <label htmlFor="saveInfo" className="text-sm text-gray-700">
              Save my info for next time
            </label>
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 w-full text-sm md:text-base px-6 py-3 rounded-md bg-[#1B1D30] text-white hover:bg-[#70B244] transition font-medium shadow-sm"
          >
            Place Order
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-[#1B1D30]">Your Order</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Review your selected items before proceeding.
          </p>
          <div className="mb-4 space-y-3">
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
              <span>KES {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>KES {subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
