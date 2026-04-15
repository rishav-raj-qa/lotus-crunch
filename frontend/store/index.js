import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Cart Store ──────────────────────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const { items } = get();
        const existing = items.find(i => i._id === product._id);
        if (existing) {
          set({ items: items.map(i => i._id === product._id ? { ...i, quantity: i.quantity + qty } : i) });
        } else {
          set({ items: [...items, { ...product, quantity: qty }] });
        }
      },

      removeItem: (id) => set(s => ({ items: s.items.filter(i => i._id !== id) })),

      updateQty: (id, qty) => {
        if (qty < 1) return get().removeItem(id);
        set(s => ({ items: s.items.map(i => i._id === id ? { ...i, quantity: qty } : i) }));
      },

      clearCart: () => set({ items: [] }),

      get count()    { return get().items.reduce((a, i) => a + i.quantity, 0); },
      get subtotal() { return get().items.reduce((a, i) => a + (i.salePrice || i.price) * i.quantity, 0); },
      get shipping() { return get().subtotal >= 499 ? 0 : 49; },
      get total()    { return get().subtotal + get().shipping; }
    }),
    { name: 'lotus-cart' }
  )
);

// ── Auth Store ──────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user:  null,
      token: null,

      setAuth: (user, token) => set({ user, token }),
      logout:  () => set({ user: null, token: null })
    }),
    { name: 'lotus-auth' }
  )
);
