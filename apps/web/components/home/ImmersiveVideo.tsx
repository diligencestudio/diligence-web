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
 * Sección de video.
 * - Desktop: full-bleed inmersivo con zoom-out lento ligado al scroll.
 * - Móvil: el video 16:9 se ve COMPLETO y compacto, con un revelado
 *   cinematográfico de entrada (sin scroll-pin ni parallax → se ve limpio).
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
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]); // solo desktop

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

  // El zoom por scroll solo en desktop; en móvil el video queda fijo y limpio.
  const motionStyle = !reduce && isDesktop ? { scale } : undefined;

  return (
    <div ref={ref} className="relative w-full bg-obsidian sm:h-[230vh]">
      <div className="relative flex w-full items-center justify-center overflow-hidden py-4 sm:sticky sm:top-0 sm:h-screen sm:py-0">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <motion.video
          ref={videoRef}
          style={motionStyle}
          // Fade-in seguro: animate en montaje (no whileInView), así el video NUNCA
          // se queda invisible aunque el observer no dispare.
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? undefined : { opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          // Móvil: banda 16:9 completa. Desktop: full-bleed object-cover.
          className="w-full object-cover aspect-video sm:absolute sm:inset-0 sm:h-full sm:aspect-auto"
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
