import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState } from '../types/cart';
import type { Product } from '../types/product';

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (product: Product, quantity: number = 1) => set((state) => {
        const existingItem = state.items.find(item => item._id === product._id);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        
        return {
          items: [...state.items, { ...product, quantity }]
        };
      }),
      
      removeItem: (productId: string) => set((state) => ({
        items: state.items.filter(item => item._id !== productId)
      })),
      
      updateQuantity: (productId: string, quantity: number) => set((state) => ({
        items: state.items.map(item =>
          item._id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      })),
      
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'safetech-cart-storage', // name of the item in the storage (must be unique)
    }
  )
);