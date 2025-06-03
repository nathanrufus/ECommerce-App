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
    <div className="border p-4 rounded-lg mb-4 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded" />
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-gray-600">Price: ${price.toFixed(2)}</p>
          <div className="mt-2 flex items-center gap-2">
            <label>Qty:</label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => onQuantityChange(id, parseInt(e.target.value))}
              className="w-16 border px-2 py-1 rounded"
            />
            <span className="text-sm text-gray-700 ml-2">
              Subtotal: ${(price * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="text-red-600 hover:underline text-sm"
      >
        Remove Item
      </button>
    </div>
  );
};

export default CartItem;
