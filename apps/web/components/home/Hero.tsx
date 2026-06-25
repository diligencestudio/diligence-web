'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@diligence/ui';
import { Countdown } from './Countdown';
import { LogoChrome } from '@/components/brand/LogoChrome';
import { LAUNCH_MODE } from '@/lib/launch';

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-24 sm:pt-28">
      {/* Fondo: degradado obsidiana con vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#161616_0%,_#050505_70%)]" />
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/diligence-hero/1920/1200?grayscale')] bg-cover bg-center opacity-20" />

      <div className="relative my-auto text-center">
        <motion.p
          className="mb-6 text-[11px] uppercase tracking-[0.5em] text-titanium"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Capítulo 01 — Obsidian
        </motion.p>

        {/* Sin animación de opacidad: opacity<1 crearía un stacking context que
            aísla el mix-blend-mode del logo y dejaría ver su fondo negro al cargar. */}
        <div className="flex justify-center">
          <LogoChrome width="clamp(280px, min(82vw, 56vh), 680px)" />
        </div>

        <motion.p
          className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-titanium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          El éxito atrae la mirada. La diligencia lo sostiene. Luxury streetwear
          para quienes construyen su propio poder.
        </motion.p>

        {/* En modo lanzamiento no hay tienda a dónde ir: ocultamos los botones. */}
        {!LAUNCH_MODE && (
          <motion.div
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link href="/tienda">
              <Button variant="primary">Explorar la colección</Button>
            </Link>
            <Link href="/coleccion/obsidian">
              <Button variant="outline">Obsidian</Button>
            </Link>
          </motion.div>
        )}

        <Countdown />
      </div>

      {/* Accesos directos + indicador de scroll: solo cuando la tienda está abierta. */}
      {!LAUNCH_MODE && (
        <>
          <motion.div
            className="absolute inset-x-0 bottom-20 z-10 flex justify-between px-10 md:px-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <Link
              href="/hombre"
              className="group flex flex-col items-start gap-2 text-pure"
            >
              <span className="text-sm uppercase tracking-[0.3em]">Hombre</span>
              <span className="h-px w-10 bg-pure/70 transition-all duration-300 group-hover:w-20" />
            </Link>
            <Link
              href="/mujer"
              className="group flex flex-col items-end gap-2 text-pure"
            >
              <span className="text-sm uppercase tracking-[0.3em]">Mujer</span>
              <span className="h-px w-10 bg-pure/70 transition-all duration-300 group-hover:w-20" />
            </Link>
          </motion.div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-titanium/50">
            Scroll
          </div>
        </>
      )}
    </section>
  );
}
