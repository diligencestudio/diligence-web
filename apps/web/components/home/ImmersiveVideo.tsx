'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';

// En desarrollo usa el archivo local; en producción, la URL del CDN (Cloudinary).
const VIDEO_SRC =
  process.env.NEXT_PUBLIC_IMMERSIVE_VIDEO_URL || '/brand/immersive.mp4';

/**
 * Sección de video inmersivo sin efectos de scroll.
 * - Desktop: full-bleed inmersivo.
 * - Móvil: encuadre vertical 4:5 full-bleed (object-cover recorta los lados
 *   del 16:9), con un revelado cinematográfico de entrada.
 * Arranca desde el inicio la primera vez que entra en viewport y queda en bucle.
 */
export function ImmersiveVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  const inView = useInView(videoRef, { amount: 0.4, once: true });
  useEffect(() => {
    const v = videoRef.current;
    if (inView && v) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
  }, [inView]);

  return (
    <div ref={ref} className="relative w-full bg-obsidian h-screen">
      <div className="relative flex w-full items-center justify-center overflow-hidden h-full">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <motion.video
          ref={videoRef}
          // Fade-in seguro: animate en montaje (no whileInView), así el video NUNCA
          // se queda invisible aunque el observer no dispare.
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          // Móvil: encuadre vertical 4:5 (cover recorta los lados del 16:9).
          // Desktop: full-bleed object-cover.
          className="w-full object-cover aspect-[4/5] sm:absolute sm:inset-0 sm:h-full sm:aspect-auto"
          loop
          muted
          playsInline
          preload="auto"
          poster="/brand/immersive-poster.jpg"
          aria-hidden="true"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </motion.video>

        {/* Funde los bordes con la obsidiana (solo en desktop full-bleed) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-28 bg-gradient-to-b from-obsidian to-transparent sm:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-obsidian to-transparent sm:block" />
      </div>
    </div>
  );
}
