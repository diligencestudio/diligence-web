'use client';

import { useState } from 'react';
import type { ProductDTO } from '@diligence/contracts';
import { Button } from '@diligence/ui';
import { useCart } from '@/store/cart';

export function AddToCart({ product }: { product: ProductDTO }) {
  const add = useCart((s) => s.add);
  const [size, setSize] = useState<string | undefined>(product.sizes[0]);
  const [color, setColor] = useState<string | undefined>(product.colors[0]);

  const needsSize = product.sizes.length > 0;
  const needsColor = product.colors.length > 0;
  const ready = (!needsSize || !!size) && (!needsColor || !!color);

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
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`min-w-12 border px-4 py-2 text-xs transition-colors ${
                  size === s
                    ? 'border-chrome text-pure'
                    : 'border-gunmetal text-titanium hover:border-titanium'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button
        variant="primary"
        className="w-full"
        disabled={!ready || product.stock <= 0}
        onClick={() => add(product, { size, color })}
      >
        {product.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
      </Button>
    </div>
  );
}
