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
 * - Modo lanzamiento + home: Header + hero, SIN footer y con scroll bloqueado.
 * - Modo lanzamiento + otras páginas (p.ej. /cuenta): Header + contenido
 *   scrolleable, sin footer (para que el registro funcione).
 * - Normal: header + footer + scroll suave.
 */
export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const teaserHome = LAUNCH_MODE && !isAdmin && pathname === '/';

  // Bloquea el scroll solo en el home del teaser.
  useEffect(() => {
    if (!teaserHome) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
    };
  }, [teaserHome]);

  if (isAdmin) return <>{children}</>;

  if (teaserHome) {
    return (
      <>
        <Header />
        <main className="h-[100svh] overflow-hidden">{children}</main>
      </>
    );
  }

  if (LAUNCH_MODE) {
    return (
      <>
        <Header />
        <main className="min-h-screen">{children}</main>
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
