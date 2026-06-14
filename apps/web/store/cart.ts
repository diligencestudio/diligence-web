'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductDTO } from '@diligence/contracts';

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  priceInCents: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  add: (product: ProductDTO, opts?: { size?: string; color?: string }) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  count: () => number;
  subtotalInCents: () => number;
}

/** Clave única de línea: producto + variante seleccionada. */
const lineKey = (l: Pick<CartLine, 'productId' | 'size' | 'color'>) =>
  `${l.productId}::${l.size ?? ''}::${l.color ?? ''}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,

      add: (product, opts = {}) =>
        set((state) => {
          const newLine: CartLine = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            priceInCents: product.priceInCents,
            image: product.images[0]?.url ?? '',
            size: opts.size,
            color: opts.color,
            quantity: 1,
          };
          const key = lineKey(newLine);
          const existing = state.lines.find((l) => lineKey(l) === key);
          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((l) =>
                lineKey(l) === key ? { ...l, quantity: l.quantity + 1 } : l,
              ),
            };
          }
          return { isOpen: true, lines: [...state.lines, newLine] };
        }),

      remove: (key) =>
        set((state) => ({ lines: state.lines.filter((l) => lineKey(l) !== key) })),

      setQuantity: (key, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (lineKey(l) === key ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        })),

      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotalInCents: () =>
        get().lines.reduce((sum, l) => sum + l.priceInCents * l.quantity, 0),
    }),
    { name: 'diligence-cart' },
  ),
);

export { lineKey };
