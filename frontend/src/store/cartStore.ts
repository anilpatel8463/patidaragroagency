import { create } from 'zustand'
import type { CartItem } from '@/types'
import { cartApi } from '@/api'

interface CartState {
  items: CartItem[]
  subtotal: number
  itemCount: number
  isLoading: boolean
  fetchCart: () => Promise<void>
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  itemCount: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true })
    try {
      const { data } = await cartApi.get()
      const cart = data.data
      set({ items: cart.items, subtotal: cart.subtotal, itemCount: cart.item_count })
    } catch {
      set({ items: [], subtotal: 0, itemCount: 0 })
    } finally {
      set({ isLoading: false })
    }
  },

  addItem: async (productId, quantity = 1) => {
    await cartApi.add(productId, quantity)
    const { data } = await cartApi.get()
    const cart = data.data
    set({ items: cart.items, subtotal: cart.subtotal, itemCount: cart.item_count })
  },

  updateQuantity: async (itemId, quantity) => {
    await cartApi.update(itemId, quantity)
    const { data } = await cartApi.get()
    const cart = data.data
    set({ items: cart.items, subtotal: cart.subtotal, itemCount: cart.item_count })
  },

  removeItem: async (itemId) => {
    await cartApi.remove(itemId)
    const { data } = await cartApi.get()
    const cart = data.data
    set({ items: cart.items, subtotal: cart.subtotal, itemCount: cart.item_count })
  },

  clearCart: async () => {
    await cartApi.clear()
    set({ items: [], subtotal: 0, itemCount: 0 })
  },
}))
