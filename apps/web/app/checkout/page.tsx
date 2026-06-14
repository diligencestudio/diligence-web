'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@diligence/ui';
import { useCart, lineKey } from '@/store/cart';
import { api } from '@/lib/api';
import { formatCOP } from '@/lib/format';

export default function CheckoutPage() {
  const { lines, subtotalInCents } = useCart();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const session = await api.createCheckout({
        items: lines.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
          size: l.size,
          color: l.color,
        })),
        customer: form,
      });
      // Redirige al Web Checkout de Wompi (sandbox).
      window.location.href = session.checkoutUrl;
    } catch {
      setError(
        'No se pudo iniciar el pago. Verifica que la API y las llaves de Wompi estén configuradas.',
      );
      setLoading(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-40 text-center">
        <p className="text-sm text-titanium">Tu carrito está vacío.</p>
        <Link href="/tienda" className="mt-6 inline-block">
          <Button variant="outline">Ir a la tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-6 pb-24 pt-32 md:grid-cols-2">
      {/* Formulario */}
      <div>
        <h1 className="wordmark text-2xl text-pure">Datos de contacto</h1>
        <form onSubmit={submit} className="mt-8 space-y-5">
          {(
            [
              { name: 'fullName', label: 'Nombre completo', type: 'text' },
              { name: 'email', label: 'Correo electrónico', type: 'email' },
              { name: 'phone', label: 'Teléfono', type: 'tel' },
            ] as const
          ).map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-titanium">
                {field.label}
              </label>
              <input
                required
                type={field.type}
                value={form[field.name]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field.name]: e.target.value }))
                }
                className="w-full border border-gunmetal bg-transparent px-4 py-3 text-sm text-pure outline-none transition-colors focus:border-chrome"
              />
            </div>
          ))}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Redirigiendo…' : `Pagar ${formatCOP(subtotalInCents())}`}
          </Button>
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-titanium/60">
            Pago seguro procesado por Wompi
          </p>
        </form>
      </div>

      {/* Resumen */}
      <div className="border border-gunmetal/60 p-6">
        <h2 className="mb-6 text-[11px] uppercase tracking-[0.3em] text-chrome">
          Resumen
        </h2>
        <ul className="divide-y divide-gunmetal/50">
          {lines.map((l) => (
            <li key={lineKey(l)} className="flex justify-between py-3 text-sm">
              <span className="text-titanium">
                {l.name} × {l.quantity}
                {l.size ? ` · ${l.size}` : ''}
              </span>
              <span className="text-chrome">
                {formatCOP(l.priceInCents * l.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-gunmetal pt-4">
          <span className="text-sm uppercase tracking-[0.2em] text-titanium">Total</span>
          <span className="text-lg text-pure">{formatCOP(subtotalInCents())}</span>
        </div>
      </div>
    </div>
  );
}
