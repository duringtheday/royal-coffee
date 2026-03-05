import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  isReview: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  setReview: (v: boolean) => void
  totalItems: () => number
  totalPrice: () => number
  orderMessage: () => string
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  isReview: false,

  addItem: (item) =>
    set((s) => {
      const ex = s.items.find((i) => i.id === item.id)
      return ex
        ? { items: s.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
        : { items: [...s.items, { ...item, quantity: 1 }] }
    }),

  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

  updateQty: (id, qty) => {
    if (qty <= 0) { get().removeItem(id); return }
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, quantity: qty } : i) }))
  },

  clearCart: () => set({ items: [], isReview: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false, isReview: false }),
  setReview: (v) => set({ isReview: v }),

  totalItems: () => get().items.reduce((a, i) => a + i.quantity, 0),
  totalPrice: () => get().items.reduce((a, i) => a + i.price * i.quantity, 0),

  orderMessage: () => {
    const { items, totalPrice } = get()
    const lines = items.map((i) => `• ${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`).join('\n')
    return encodeURIComponent(`👑 *Royal Coffee & Tea — New Order*\n\n${lines}\n\n*Total: $${totalPrice().toFixed(2)}*\n\nThank you! ☕`)
  },
}))
