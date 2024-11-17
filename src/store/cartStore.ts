// src\store\cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/types';

type CartState = {
  items: Product[];
  wishlist: Product[];
  isCartOpen: boolean;
  addToCart: (item: Product) => void;
  addToWishlist: (item: Product) => void;
  removeFromWishlist: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  updateQuantity: (id: string, action: 'increase' | 'decrease') => void;
  cartItemCount: () => number;
  wishlistItemCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      isCartOpen: false,

      // Add item to cart
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

      // Add item to wishlist if not already added
      addToWishlist: (item) =>
        set((state) => {
          if (!state.wishlist.find((i) => i.id === item.id)) {
            return { wishlist: [...state.wishlist, item] };
          }
          return state;
        }),

      // Remove item from wishlist by ID
      removeFromWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.filter((i) => i.id !== id),
        })),

      // Remove item from cart by ID
      removeFromCart: (id: string) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      // Clear the cart
      clearCart: () => set({ items: [] }),

      // Toggle cart open/closed, or set explicitly
      toggleCart: (open) =>
        set((state) => ({
          isCartOpen: open !== undefined ? open : !state.isCartOpen,
        })),

      // Update quantity of a cart item
      updateQuantity: (id: string, action: 'increase' | 'decrease') =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: action === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1),
                }
              : item
          ),
        })),

      // Count total items in the cart
      cartItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),

      // Count total items in the wishlist
      wishlistItemCount: () => get().wishlist.length,
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, wishlist: state.wishlist }), // Include items and wishlist
    }
  )
);
