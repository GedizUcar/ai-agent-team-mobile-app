import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;

  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
}

const calculateTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
});

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId && item.variantId === newItem.variantId,
          );

          let items: CartItem[];
          if (existingIndex >= 0) {
            items = state.items.map((item, index) =>
              index === existingIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item,
            );
          } else {
            items = [...state.items, newItem];
          }

          return { items, ...calculateTotals(items) };
        }),

      removeItem: (productId, variantId) =>
        set((state) => {
          const items = state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId),
          );
          return { items, ...calculateTotals(items) };
        }),

      updateQuantity: (productId, quantity, variantId) =>
        set((state) => {
          if (quantity <= 0) {
            const items = state.items.filter(
              (item) => !(item.productId === productId && item.variantId === variantId),
            );
            return { items, ...calculateTotals(items) };
          }

          const items = state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item,
          );
          return { items, ...calculateTotals(items) };
        }),

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'stilora-cart',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
