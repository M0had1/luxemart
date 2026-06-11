import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Cart Store ───────────────────────────────────────────────
export const useCartStore = create(persist(
  (set, get) => ({
    items: [],
    isOpen: false,
    addItem: (product, qty = 1) => {
      const items = get().items
      const existing = items.find(i => i.id === product.id)
      if (existing) {
        set({ items: items.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i) })
      } else {
        set({ items: [...items, { ...product, qty }] })
      }
    },
    removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
    updateQty: (id, qty) => {
      if (qty < 1) return get().removeItem(id)
      set({ items: get().items.map(i => i.id === id ? { ...i, qty } : i) })
    },
    clearCart: () => set({ items: [] }),
    openCart:  () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    toggleCart:() => set({ isOpen: !get().isOpen }),
    get total() {
      return get().items.reduce((s, i) => s + i.price * i.qty, 0)
    },
    get count() {
      return get().items.reduce((s, i) => s + i.qty, 0)
    },
  }),
  { name: 'luxemart-cart' }
))

// ── Admin Auth Store ─────────────────────────────────────────
export const useAdminStore = create(persist(
  (set) => ({
    isLoggedIn: false,
    admin: null,
    login:  (admin) => set({ isLoggedIn: true, admin }),
    logout: ()      => set({ isLoggedIn: false, admin: null }),
  }),
  { name: 'luxemart-admin', partialize: (s) => ({ isLoggedIn: s.isLoggedIn, admin: s.admin }) }
))

// ── UI Store ─────────────────────────────────────────────────
export const useUIStore = create((set) => ({
  searchQuery: '',
  selectedCategory: 'All',
  sortBy: 'featured',
  setSearch:   (q)  => set({ searchQuery: q }),
  setCategory: (c)  => set({ selectedCategory: c }),
  setSort:     (s)  => set({ sortBy: s }),
}))

// ── Settings Store ───────────────────────────────────────────
export const useSettingsStore = create((set) => ({
  settings: {},
  setSettings: (s) => set({ settings: s }),
  updateSetting: (k, v) => set(state => ({ settings: { ...state.settings, [k]: v } })),
}))
