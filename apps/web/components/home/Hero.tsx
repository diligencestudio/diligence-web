'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { CollectionDTO } from '@diligence/contracts';
import { Button } from '@diligence/ui';
import { LogoChrome } from '@/components/brand/LogoChrome';
import { LAUNCH_MODE } from '@/lib/launch';

interface HeroProps {
  /** Colección actual a la que apunta el CTA secundario. Null la oculta. */
  currentCollection?: Pick<CollectionDTO, 'slug' | 'title'> | null;
}

export function Hero({ currentCollection = null }: HeroProps) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.75rem)] pt-32 sm:pb-16 lg:pt-28">
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
          (párrafo, CTA), que cae sobre las zonas claras de la foto. */}
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
            {/* CTA secundario: colección actual. Se oculta si aún no hay ninguna,
                así nunca lleva a un 404. */}
            {currentCollection && (
              <Link href={`/coleccion/${currentCollection.slug}`}>
                <Button variant="outline">{currentCollection.title}</Button>
              </Link>
            )}
          </motion.div>
        )}

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

      {/* Accesos directos + indicador de scroll: solo cuando la tienda está abierta. */}
      {!LAUNCH_MODE && (
        <>
          {/* Solo desktop: en móvil ya están en el menú. */}
          <motion.div
            className="absolute inset-x-0 bottom-20 z-10 hidden justify-between px-10 md:flex md:px-20"
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

          {/* Solo desktop: en móvil el hero ya llega justo al borde inferior. */}
          <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-titanium/50 md:block">
            Scroll
          </div>
        </>
      )}
    </section>
  );
}
