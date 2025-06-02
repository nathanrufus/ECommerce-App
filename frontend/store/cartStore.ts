import { create } from 'zustand';

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };
  
  type CartStore = {
    cartItems: CartItem[];
    subtotal: number;
    addToCart: (item: CartItem) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    loadFromStorage: () => void;
  };
  
  const useCartStore = create<CartStore>((set, get) => ({
    cartItems: [],
    subtotal: 0,
  
    addToCart: (item) => {
      const existing = get().cartItems.find(i => i.id === item.id);
  
      const updatedCart = existing
        ? get().cartItems.map(i =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...get().cartItems, item];
  
if (typeof window !== 'undefined') {
  localStorage.setItem('cart', JSON.stringify(updatedCart));
}
      set({ cartItems: updatedCart, subtotal: calculateSubtotal(updatedCart) });
    },
  
    updateQuantity: (id, quantity) => {
      const items = get().cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(items));
      set({ cartItems: items, subtotal: calculateSubtotal(items) });
    },
  
    removeItem: (id) => {
      const items = get().cartItems.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(items));
      set({ cartItems: items, subtotal: calculateSubtotal(items) });
    },
  
    loadFromStorage: () => {
      const stored = localStorage.getItem('cart');
      const parsed = stored ? (JSON.parse(stored) as CartItem[]) : [];
      set({ cartItems: parsed, subtotal: calculateSubtotal(parsed) });
    }
  }));
  
  function calculateSubtotal(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  
  export default useCartStore;
  
