'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';

/**
 * Envuelve el contenido del sitio. En las rutas /admin no muestra el header,
 * footer ni el scroll suave de la tienda (el admin es una herramienta interna).
 */
export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <SmoothScroll />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
