'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { OrderDTO, OrderStatus } from '@diligence/contracts';
import { Button, MetalText } from '@diligence/ui';
import { useCart } from '@/store/cart';

const COPY: Record<OrderStatus, { title: string; message: string }> = {
  APPROVED: { title: 'Pago aprobado', message: 'Gracias por tu compra. Recibirás un correo de confirmación.' },
  PENDING: { title: 'Pago pendiente', message: 'Estamos confirmando tu pago. Esto puede tardar unos instantes…' },
  DECLINED: { title: 'Pago rechazado', message: 'Tu pago no fue aprobado. Intenta con otro medio de pago.' },
  VOIDED: { title: 'Pago anulado', message: 'La transacción fue anulada.' },
  ERROR: { title: 'Error en el pago', message: 'Ocurrió un error procesando el pago.' },
};

function Result() {
  const params = useSearchParams();
  const ref = params.get('ref');
  const clear = useCart((s) => s.clear);
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (!ref) return;
    let active = true;

    const poll = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
        const res = await fetch(`${api}/api/orders/by-reference?ref=${ref}`);
        if (res.ok && active) {
          const data: OrderDTO = await res.json();
          setOrder(data);
          if (data.status === 'APPROVED') clear();
          if (data.status === 'PENDING' && tries < 8) {
            setTimeout(() => setTries((t) => t + 1), 2500);
          }
        }
      } catch {
        /* reintenta en el siguiente tick */
      }
    };

    void poll();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, tries]);

  const status: OrderStatus = order?.status ?? 'PENDING';
  const copy = COPY[status];

  return (
    <div className="mx-auto max-w-xl px-6 pb-24 pt-40 text-center">
      <MetalText as="h1" className="wordmark text-3xl md:text-4xl">
        {copy.title}
      </MetalText>
      <p className="mx-auto mt-5 max-w-sm text-sm text-titanium">{copy.message}</p>
      {ref && (
        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-titanium/60">
          Referencia: {ref}
        </p>
      )}
      <div className="mt-10 flex justify-center gap-4">
        <Link href="/tienda">
          <Button variant="outline">Seguir comprando</Button>
        </Link>
        <Link href="/">
          <Button variant="ghost">Inicio</Button>
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-titanium">Cargando…</div>}>
      <Result />
    </Suspense>
  );
}
