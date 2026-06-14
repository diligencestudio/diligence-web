'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MetalText, Button } from '@diligence/ui';
import { Countdown } from './Countdown';

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Fondo: degradado obsidiana con vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#161616_0%,_#050505_70%)]" />
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/diligence-hero/1920/1200?grayscale')] bg-cover bg-center opacity-20" />

      <div className="relative z-10 px-6 text-center">
        <motion.p
          className="mb-6 text-[11px] uppercase tracking-[0.5em] text-titanium"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Colección Obsidian — 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <MetalText
            as="span"
            className="block wordmark text-5xl leading-none md:text-8xl"
          >
            DILIGENCE
          </MetalText>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-titanium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Lujo oscuro. Precisión absoluta. Cortes arquitectónicos en una paleta
          monocromática de acabados metálicos.
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Link href="/tienda">
            <Button variant="primary">Explorar tienda</Button>
          </Link>
          <Link href="/coleccion/obsidian">
            <Button variant="outline">Ver Obsidian</Button>
          </Link>
        </motion.div>

        <Countdown />
      </div>

      {/* Accesos directos a secciones (estilo editorial) */}
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
    </section>
  );
}
