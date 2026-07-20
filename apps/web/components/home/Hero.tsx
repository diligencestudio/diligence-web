'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@diligence/ui';
import { Countdown } from './Countdown';
import { LogoChrome } from '@/components/brand/LogoChrome';
import { LAUNCH_MODE } from '@/lib/launch';
import { getLenis } from '@/lib/smooth-scroll';

// Accesos de categoría visibles en la portada (además del header).
const CATEGORIES = [
  { label: 'Hombre', href: '/hombre' },
  { label: 'Mujer', href: '/mujer' },
  { label: 'Colecciones', href: '/colecciones' },
];

/**
 * Hero = "capa principal" / portada. Es un overlay fijo a pantalla completa que
 * cubre todo al entrar, con el scroll bloqueado. Al pulsar "Explorar la tienda"
 * la capa se desvanece y se DESMONTA: la tienda queda como la página real, así
 * que al hacer scroll hacia arriba ya no se vuelve a ver el hero.
 */
export function Hero() {
  const [explored, setExplored] = useState(false);

  useEffect(() => {
    // En modo lanzamiento el bloqueo lo maneja StorefrontChrome (no hay tienda).
    if (LAUNCH_MODE || explored) return;

    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    getLenis()?.stop();

    return () => {
      html.style.overflow = prev;
      getLenis()?.start();
    };
  }, [explored]);

  const explore = () => setExplored(true);

  return (
    <AnimatePresence>
      {!explored && (
        <motion.section
          key="hero"
          exit={{ opacity: 0, y: -48 }}
          transition={{ duration: 0.7, ease: [0.6, 0.01, 0, 0.95] }}
          // z-[60] queda por ENCIMA del header (z-50): la portada tapa el navbar.
          // Al explorar, el hero se desmonta y el navbar reaparece.
          // En móvil menos padding superior (el navbar está oculto) para subir el
          // contenido; tablet/desktop mantienen su espaciado.
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden px-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.75rem)] pt-6 sm:pb-16 sm:pt-32 lg:pt-28"
        >
          {/* Fondo: foto de campaña sobre obsidiana */}
          <div className="absolute inset-0 bg-obsidian" />
          <Image
            src="/brand/IMG_0733.JPEG"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-70"
          />
          {/* Viñeteado radial: oscurece la zona del logo (que usa mix-blend lighten
              y necesita fondo oscuro) y deja respirar la foto en los bordes. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_36%,_rgba(5,5,5,0.82)_0%,_rgba(5,5,5,0.5)_42%,_rgba(5,5,5,0.28)_100%)]" />
          {/* Scrim vertical: refuerza la legibilidad del texto de la mitad inferior
              (párrafo, contador, CTA), que cae sobre las zonas claras de la foto. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(5,5,5,0.5)_0%,_transparent_22%,_transparent_38%,_rgba(5,5,5,0.6)_62%,_rgba(5,5,5,0.88)_100%)]" />

          <div className="relative my-auto text-center [text-shadow:0_2px_18px_rgba(5,5,5,0.95)]">
            <motion.p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.5em] text-chrome sm:mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              ACT 01 — REALIZING
            </motion.p>

            {/* Sin animación de opacidad: opacity<1 crearía un stacking context que
                aísla el mix-blend-mode del logo y dejaría ver su fondo negro al cargar. */}
            <div className="flex justify-center">
              {/* El video fuente mide 828px de ancho. En móvil manda 70vw (a 3x ≈ 828px
                  nativos → nítido). En desktop/retina, un tamaño mayor estira el video por
                  encima de su resolución y se pixela; por eso el tope (48svh / 680px) se
                  mantiene cerca de los 828px reales aun contando el 2x de pantallas retina. */}
              <LogoChrome width="clamp(240px, min(70vw, 48svh), 680px)" />
            </div>

            <motion.p
              className="mx-auto mt-5 max-w-md text-[15px] font-semibold uppercase leading-relaxed tracking-[0.22em] text-chrome sm:mt-6 sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Ambition has a uniform
            </motion.p>

            {/* En modo lanzamiento no hay tienda a dónde ir: ocultamos el CTA + nav. */}
            {!LAUNCH_MODE && (
              <>
                <motion.div
                  className="mt-9 flex justify-center"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  {/* CTA principal: descarta la portada y entra a la tienda. */}
                  <Button variant="primary" onClick={explore}>
                    Explorar la tienda
                  </Button>
                </motion.div>

                {/* Accesos de categoría en la portada (visibles en todos los tamaños). */}
                <motion.nav
                  className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.3em]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="text-titanium transition-colors hover:text-pure"
                    >
                      {c.label}
                    </Link>
                  ))}
                </motion.nav>
              </>
            )}

            <Countdown />

            {/* Modo lanzamiento: CTA para que los usuarios se registren antes del drop. */}
            {LAUNCH_MODE && (
              <motion.div
                className="mt-7 flex justify-center sm:mt-10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Link
                  href="/cuenta?registro=1"
                  className="inline-flex items-center justify-center border border-chrome/30 bg-white/[0.04] px-10 py-3.5 text-xs uppercase tracking-[0.28em] backdrop-blur-sm transition-all duration-300 hover:border-chrome/70 hover:bg-white/[0.08]"
                >
                  <span className="metal-text">Regístrate</span>
                </Link>
              </motion.div>
            )}
          </div>

        </motion.section>
      )}
    </AnimatePresence>
  );
}
