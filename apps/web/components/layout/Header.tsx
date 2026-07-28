'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wordmark } from '@diligence/ui';
import { useCart } from '@/store/cart';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchIcon, AccountIcon, CartIcon } from './icons';
import { LAUNCH_MODE } from '@/lib/launch';

const LEFT_NAV = [
  { label: 'All', href: '/tienda' },
  { label: 'Hombre', href: '/hombre' },
  { label: 'Mujer', href: '/mujer' },
  { label: 'Colecciones', href: '/colecciones' },
];

const RIGHT_NAV: { label: string; href: string }[] = [];

const linkCls =
  'text-[11px] uppercase tracking-[0.22em] text-titanium transition-colors hover:text-pure';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  // El carrito vive en localStorage; solo mostramos su contador tras montar
  // en el cliente para evitar mismatch de hidratación (server siempre = 0).
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-obsidian/85 backdrop-blur-md border-b border-gunmetal/60'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5">
          {/* Izquierda: navegación principal (oculta en modo lanzamiento) */}
          {LAUNCH_MODE ? (
            <span className="flex-1" />
          ) : (
            <nav className="hidden flex-1 items-center gap-7 lg:flex">
              {LEFT_NAV.map((item) => (
                <Link key={item.href} href={item.href} className={linkCls}>
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Centro: wordmark */}
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 lg:flex-none"
          >
            <Wordmark />
          </Link>

          {/* Derecha: en lanzamiento solo el acceso a cuenta/registro */}
          <div className="flex flex-1 items-center justify-end gap-5">
            {!LAUNCH_MODE && (
              <nav className="hidden items-center gap-6 lg:flex">
                {RIGHT_NAV.map((item) => (
                  <Link key={item.href} href={item.href} className={linkCls}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
            {!LAUNCH_MODE && (
              <Link href="/buscar" aria-label="Buscar" className="text-titanium hover:text-pure">
                <SearchIcon />
              </Link>
            )}
            <Link
              href="/cuenta"
              aria-label="Cuenta"
              className={`text-titanium hover:text-pure ${LAUNCH_MODE ? 'block' : 'hidden sm:block'}`}
            >
              <AccountIcon />
            </Link>
            {!LAUNCH_MODE && (
              <button
                onClick={openCart}
                aria-label="Abrir carrito"
                className="relative text-titanium hover:text-pure"
              >
                <CartIcon />
                {mounted && count > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-pure px-1 text-[10px] font-medium text-obsidian">
                    {count}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navegación móvil (oculta en modo lanzamiento) */}
        {!LAUNCH_MODE && (
          <nav className="flex items-center justify-center gap-5 overflow-x-auto border-t border-gunmetal/40 px-6 py-3 lg:hidden">
            {[...LEFT_NAV, ...RIGHT_NAV].map((item) => (
              <Link key={item.href} href={item.href} className={`${linkCls} whitespace-nowrap`}>
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      {!LAUNCH_MODE && <CartDrawer />}
    </>
  );
}
