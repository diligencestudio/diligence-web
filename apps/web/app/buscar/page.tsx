'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ProductDTO } from '@diligence/contracts';
import { MetalText } from '@diligence/ui';
import { ProductGrid } from '@/components/product/ProductGrid';

function Search() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get('q') ?? '';
  const [term, setTerm] = useState(initial);
  const [results, setResults] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = initial.trim();
    if (!q) {
      setResults([]);
      return;
    }
    let active = true;
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
    fetch(`${apiUrl}/api/products?search=${encodeURIComponent(q)}&limit=100`)
      .then((r) => r.json())
      .then((d: { items: ProductDTO[] }) => {
        if (active) setResults(d.items ?? []);
      })
      .catch(() => active && setResults([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/buscar?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <div className="mb-14 text-center">
        <MetalText as="h1" className="wordmark text-3xl md:text-4xl">
          Buscar
        </MetalText>
        <form onSubmit={submit} className="mx-auto mt-8 max-w-md">
          <input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="¿Qué buscas?"
            className="w-full border-b border-gunmetal bg-transparent pb-3 text-center text-lg text-pure outline-none transition-colors focus:border-chrome"
          />
        </form>
      </div>

      {initial && !loading && results.length === 0 && (
        <p className="py-16 text-center text-sm text-titanium">
          Sin resultados para “{initial}”.
        </p>
      )}
      {results.length > 0 && <ProductGrid products={results} />}
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-titanium">Cargando…</div>}>
      <Search />
    </Suspense>
  );
}
