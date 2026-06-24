'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';
import { LAUNCH_MODE } from '@/lib/launch';

/**
 * Envuelve el contenido del sitio.
 * - /admin: sin chrome (herramienta interna).
 * - Modo lanzamiento: Header (solo logo + cuenta) + hero, SIN footer, con el
 *   scroll bloqueado (pantalla única).
 * - Normal: header + footer + scroll suave.
 */
export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const teaser = LAUNCH_MODE && !isAdmin;

  // Bloquea el scroll mientras el sitio está en modo lanzamiento.
  useEffect(() => {
    if (!teaser) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
    };
  }, [teaser]);

  if (isAdmin) return <>{children}</>;

  if (teaser) {
    return (
      <>
        <Header />
        <main className="h-[100svh] overflow-hidden">{children}</main>
      </>
    );
  }

  return (
    <>
      <SmoothScroll />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
