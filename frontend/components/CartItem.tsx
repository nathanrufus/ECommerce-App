'use client';
import React from 'react';

type CartItemProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  onQuantityChange,
  onRemove,
}) => {
  return (
    <div className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-start sm:items-center gap-4 w-full">
        <div className="w-16 h-16 bg-gray-100 rounded-lg" />
        <div className="flex-grow">
          <h3 className="font-semibold text-[#1B1D30] text-base sm:text-lg">{name}</h3>
          <p className="text-sm text-gray-600">Price: KES {price.toFixed(2)}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <label className="text-[#1B1D30]">Qty:</label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => onQuantityChange(id, parseInt(e.target.value))}
              className="w-16 border border-gray-300 px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#70B244]"
            />
            <span className="text-gray-700 ml-2">
              Subtotal: KES {(price * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 self-end sm:self-auto">
        <button
          onClick={() => onRemove(id)}
          className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
