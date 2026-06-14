'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@diligence/ui';
import { useCart, lineKey } from '@/store/cart';
import { formatCOP } from '@/lib/format';

export function CartDrawer() {
  const { lines, isOpen, close, remove, setQuantity, subtotalInCents } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-obsidian/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-gunmetal bg-graphite"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-gunmetal px-6 py-5">
              <span className="text-xs uppercase tracking-[0.3em] text-chrome">
                Tu carrito
              </span>
              <button
                onClick={close}
                className="text-titanium hover:text-pure"
                aria-label="Cerrar carrito"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <p className="py-16 text-center text-sm text-titanium">
                  Tu carrito está vacío.
                </p>
              ) : (
                <ul className="divide-y divide-gunmetal/60">
                  {lines.map((line) => {
                    const key = lineKey(line);
                    return (
                      <li key={key} className="flex gap-4 py-5">
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-gunmetal">
                          {line.image && (
                            <Image
                              src={line.image}
                              alt={line.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="text-sm text-pure">{line.name}</p>
                            <p className="text-xs text-titanium">
                              {[line.size, line.color].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm text-chrome">
                              <button
                                onClick={() => setQuantity(key, line.quantity - 1)}
                                className="hover:text-pure"
                              >
                                −
                              </button>
                              <span>{line.quantity}</span>
                              <button
                                onClick={() => setQuantity(key, line.quantity + 1)}
                                className="hover:text-pure"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm text-chrome">
                              {formatCOP(line.priceInCents * line.quantity)}
                            </span>
                          </div>
                          <button
                            onClick={() => remove(key)}
                            className="mt-1 self-start text-[10px] uppercase tracking-widest text-titanium/70 hover:text-pure"
                          >
                            Quitar
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-t border-gunmetal px-6 py-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-titanium">
                  Subtotal
                </span>
                <span className="text-lg text-pure">{formatCOP(subtotalInCents())}</span>
              </div>
              <Link href="/checkout" onClick={close}>
                <Button variant="primary" className="w-full" disabled={lines.length === 0}>
                  Finalizar compra
                </Button>
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
