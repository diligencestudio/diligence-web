'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { token } from '@/lib/admin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!token.get()) {
      router.replace('/admin/login');
      return;
    }
    setReady(true);
  }, [isLogin, router]);

  if (!ready) return null;

  if (isLogin) return <div className="min-h-screen bg-obsidian">{children}</div>;

  return (
    <div className="min-h-screen bg-obsidian text-chrome">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gunmetal/60 bg-obsidian/90 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="wordmark text-sm tracking-[0.3em] text-pure"
          >
            DILIGENCE · ADMIN
          </Link>
          <nav className="hidden gap-5 sm:flex">
            <Link href="/admin" className="text-[11px] uppercase tracking-[0.2em] text-titanium hover:text-pure">
              Productos
            </Link>
            <Link href="/admin/colecciones/nuevo" className="text-[11px] uppercase tracking-[0.2em] text-titanium hover:text-pure">
              + Colección
            </Link>
            <Link href="/admin/productos/nuevo" className="text-[11px] uppercase tracking-[0.2em] text-titanium hover:text-pure">
              + Producto
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/" target="_blank" className="text-[11px] uppercase tracking-[0.2em] text-titanium hover:text-pure">
            Ver tienda ↗
          </Link>
          <button
            onClick={() => {
              token.clear();
              router.replace('/admin/login');
            }}
            className="text-[11px] uppercase tracking-[0.2em] text-titanium hover:text-pure"
          >
            Salir
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
