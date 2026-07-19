'use client';

import { useState } from 'react';
import type { ProductDTO } from '@diligence/contracts';
import { Button } from '@diligence/ui';
import { useCart } from '@/store/cart';

export function AddToCart({ product }: { product: ProductDTO }) {
  const add = useCart((s) => s.add);

  const needsSize = product.sizes.length > 0;
  const needsColor = product.colors.length > 0;

  // Stock disponible por talla (0 si no está listada en sizeStock).
  const stockOf = (s: string) =>
    product.sizeStock.find((x) => x.size === s)?.stock ?? 0;

  // Selección inicial: primera talla con stock, o la primera si ninguna tiene.
  const firstAvailable =
    product.sizes.find((s) => stockOf(s) > 0) ?? product.sizes[0];
  const [size, setSize] = useState<string | undefined>(firstAvailable);
  const [color, setColor] = useState<string | undefined>(product.colors[0]);

  // Con tallas, la disponibilidad depende de la talla elegida; sin tallas, del stock total.
  const inStock = needsSize
    ? !!size && stockOf(size) > 0
    : product.stock > 0;
  const ready = (!needsSize || !!size) && (!needsColor || !!color) && inStock;

  return (
    <div className="space-y-8">
      {needsColor && (
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-titanium">
            Color
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`border px-4 py-2 text-xs transition-colors ${
                  color === c
                    ? 'border-chrome text-pure'
                    : 'border-gunmetal text-titanium hover:border-titanium'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {needsSize && (
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-titanium">
            Talla
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const soldOut = stockOf(s) <= 0;
              return (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  disabled={soldOut}
                  title={soldOut ? 'Agotada' : undefined}
                  className={`min-w-12 border px-4 py-2 text-xs transition-colors ${
                    soldOut
                      ? 'cursor-not-allowed border-gunmetal/50 text-titanium/40 line-through'
                      : size === s
                        ? 'border-chrome text-pure'
                        : 'border-gunmetal text-titanium hover:border-titanium'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Button
        variant="primary"
        className="w-full"
        disabled={!ready}
        onClick={() => add(product, { size, color })}
      >
        {inStock ? 'Añadir al carrito' : 'Agotado'}
      </Button>
    </div>
  );
}
