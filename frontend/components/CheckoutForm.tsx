import React from "react"

type CheckoutFormProps = {
  form: ShippingInfo
  setForm: (field: keyof ShippingInfo, value: string) => void
}

export type ShippingInfo = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ form, setForm }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1B1D30] mb-6">
        Shipping Information
      </h2>
      <div className="grid gap-4">
        {[
          { label: "Name", key: "name", type: "text" },
          { label: "Email", key: "email", type: "email" },
          { label: "Phone", key: "phone", type: "tel" },
          { label: "Address", key: "address", type: "text" },
          { label: "City", key: "city", type: "text" },
          { label: "Zip", key: "zip", type: "text" },
        ].map(({ label, key, type }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type={type}
              value={form[key as keyof ShippingInfo]}
              onChange={(e) => setForm(key as keyof ShippingInfo, e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
              required
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CheckoutForm
