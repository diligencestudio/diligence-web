'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CollectionDTO, ProductDTO } from '@diligence/contracts';
import { adminApi } from '@/lib/admin';
import { formatCOP } from '@/lib/format';

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [collections, setCollections] = useState<CollectionDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.listProducts(), adminApi.listCollections()])
      .then(([p, c]) => {
        setProducts(p);
        setCollections(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const removeProduct = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    await adminApi.deleteProduct(id);
    load();
  };

  const removeCollection = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar la colección "${title}"?`)) return;
    await adminApi.deleteCollection(id);
    load();
  };

  if (loading) return <p className="text-sm text-titanium">Cargando…</p>;

  return (
    <div className="space-y-14">
      {/* Productos */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="wordmark text-xl text-pure">
            Productos <span className="text-titanium">({products.length})</span>
          </h2>
          <Link
            href="/admin/productos/nuevo"
            className="border border-titanium/50 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-chrome hover:border-chrome hover:text-pure"
          >
            + Nuevo producto
          </Link>
        </div>
        <div className="divide-y divide-gunmetal/50 border-y border-gunmetal/50">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${p.stock > 0 ? 'bg-chrome' : 'bg-titanium/40'}`}
                  title={p.stock > 0 ? 'En stock' : 'Sin stock'}
                />
                <span className="truncate text-sm text-pure">{p.name}</span>
                <span className="hidden text-[11px] uppercase tracking-[0.15em] text-titanium sm:inline">
                  {p.section} · {p.category}
                </span>
                {p.onSale && <span className="text-[10px] uppercase tracking-widest text-pure/80">sale</span>}
              </div>
              <div className="flex items-center gap-5 text-sm">
                <span className="text-chrome">{formatCOP(p.priceInCents)}</span>
                <Link href={`/admin/productos/${p.id}`} className="text-[11px] uppercase tracking-[0.2em] text-titanium hover:text-pure">
                  Editar
                </Link>
                <button onClick={() => removeProduct(p.id, p.name)} className="text-[11px] uppercase tracking-[0.2em] text-titanium/70 hover:text-red-400">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="py-6 text-sm text-titanium">Aún no hay productos. Crea el primero.</p>}
        </div>
      </section>

      {/* Colecciones */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="wordmark text-xl text-pure">
            Colecciones <span className="text-titanium">({collections.length})</span>
          </h2>
          <Link
            href="/admin/colecciones/nuevo"
            className="border border-titanium/50 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-chrome hover:border-chrome hover:text-pure"
          >
            + Nueva colección
          </Link>
        </div>
        <div className="divide-y divide-gunmetal/50 border-y border-gunmetal/50">
          {collections.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 py-3">
              <span className="truncate text-sm text-pure">{c.title}</span>
              <div className="flex items-center gap-5">
                <span className="text-[11px] uppercase tracking-[0.15em] text-titanium">/{c.slug}</span>
                <Link href={`/admin/colecciones/${c.id}`} className="text-[11px] uppercase tracking-[0.2em] text-titanium hover:text-pure">
                  Editar
                </Link>
                <button onClick={() => removeCollection(c.id, c.title)} className="text-[11px] uppercase tracking-[0.2em] text-titanium/70 hover:text-red-400">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {collections.length === 0 && <p className="py-6 text-sm text-titanium">Aún no hay colecciones.</p>}
        </div>
      </section>
    </div>
  );
}
