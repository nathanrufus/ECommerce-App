import React from "react"

type CartPreviewItemProps = {
  name: string
  quantity: number
  price: number
}

const CartPreviewItem: React.FC<CartPreviewItemProps> = ({ name, quantity, price }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm mb-3 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-semibold text-[#1B1D30]">{name}</h4>
          <p className="text-xs text-gray-500">Qty: {quantity}</p>
        </div>
        <p className="text-sm font-medium text-gray-800">KES {(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  )
}

export default CartPreviewItem
