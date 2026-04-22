import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState } from '../types/cart';
import type { Product } from '../types/product';

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,
      
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      
      addItem: (product: Product, quantity: number = 1) => set((state) => {
        const existingItem = state.items.find(item => item._id === product._id);
        
        if (existingItem) {
          return {
            items: state.items.map(item => {
              if (item._id === product._id) {
                const newQuantity = Math.min(item.quantity + quantity, product.stock);
                return { ...item, quantity: newQuantity };
              }
              return item;
            })
          };
        }
        
        const initialQuantity = Math.min(quantity, product.stock);
        return {
          items: [...state.items, { ...product, quantity: initialQuantity }]
        };
      }),
      
      removeItem: (productId: string) => set((state) => ({
        items: state.items.filter(item => item._id !== productId)
      })),
      
      updateQuantity: (productId: string, quantity: number) => set((state) => ({
        items: state.items.map(item => {
          if (item._id === productId) {
            const newQuantity = Math.min(Math.max(1, quantity), item.stock);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      })),
      
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'safetech-cart-storage', // name of the item in the storage (must be unique)
    }
  )
);