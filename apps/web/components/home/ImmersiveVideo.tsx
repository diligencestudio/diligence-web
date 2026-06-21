'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

// En desarrollo usa el archivo local; en producción, la URL del CDN (Cloudinary).
const VIDEO_SRC =
  process.env.NEXT_PUBLIC_IMMERSIVE_VIDEO_URL || '/brand/immersive.mp4';

/**
 * Reveal cinematográfico ligado al scroll, SIN texto superpuesto.
 * - Desktop: video fijo (sticky) a pantalla completa con zoom-out lento al hacer
 *   scroll (object-cover, full-bleed inmersivo).
 * - Móvil: el contenedor toma la proporción 16:9 del video y sin zoom, para que
 *   se vea el video COMPLETO sin recortes.
 * Arranca desde el inicio la primera vez que entra en viewport y queda en bucle.
 */
export function ImmersiveVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);

  // El zoom y el pin solo en desktop (≥640px). En móvil queremos el video entero.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const inView = useInView(videoRef, { amount: 0.4, once: true });
  useEffect(() => {
    const v = videoRef.current;
    if (inView && v) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative w-full bg-obsidian aspect-video sm:aspect-auto sm:h-[230vh]"
    >
      <div className="relative h-full w-full overflow-hidden sm:sticky sm:top-0 sm:h-screen">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <motion.video
          ref={videoRef}
          style={{ scale: isDesktop && !reduce ? scale : 1 }}
          className="absolute inset-0 h-full w-full object-cover"
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
        <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-32 bg-gradient-to-b from-obsidian to-transparent sm:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-obsidian to-transparent sm:block" />
      </div>
    </div>
  );
}
