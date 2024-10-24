// Path: src\store\cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/types';

type CartState = {
  items: Product[];
  wishlist: Product[];
  isCartOpen: boolean;
  addToCart: (item: Product) => void;
  addToWishlist: (item: Product) => void;
  removeFromWishlist: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  updateQuantity: (id: number, action: 'increase' | 'decrease') => void; // Add this line
  cartItemCount: () => number;
  wishlistItemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      isCartOpen: false,
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            };
          } else {
            return { items: [...state.items, { ...item, quantity: 1 }] };
          }
        }),
      addToWishlist: (item) =>
        set((state) => {
          if (!state.wishlist.find((i) => i.id === item.id)) {
            return { wishlist: [...state.wishlist, item] };
          }
          return state;
        }),
      removeFromWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.filter((i) => i.id !== id.toString()),
        })),
      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id.toString()),
        })),
      clearCart: () => set({ items: [] }),
      toggleCart: (open) =>
        set((state) => ({
          isCartOpen: open !== undefined ? open : !state.isCartOpen,
        })),
      updateQuantity: (id, action) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id.toString()
              ? {
                  ...item,
                  quantity: action === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
                }
              : item
          ),
        })),
      cartItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
      wishlistItemCount: () => get().wishlist.length,
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ wishlist: state.wishlist }),
    }
  )
);
