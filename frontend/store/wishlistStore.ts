import { create } from 'zustand';

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type WishlistStore = {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  loadWishlist: () => void;
  clearWishlist: () => void;
};

const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: [],

  addToWishlist: (item) => {
    const exists = get().wishlist.some(i => i.id === item.id);
    if (exists) return;
    const updated = [...get().wishlist, item];
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(updated));
    }
    set({ wishlist: updated });
  },

  removeFromWishlist: (id) => {
    const updated = get().wishlist.filter(i => i.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(updated));
    }
    set({ wishlist: updated });
  },

  isInWishlist: (id) => {
    return get().wishlist.some(item => item.id === id);
  },

  loadWishlist: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wishlist');
      const parsed = stored ? JSON.parse(stored) : [];
      set({ wishlist: parsed });
    }
  },

  clearWishlist: () => {
    localStorage.removeItem('wishlist');
    set({ wishlist: [] });
  },
}));

export default useWishlistStore;
