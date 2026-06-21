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
 * Sección de video inmersiva a pantalla completa (sticky), fondo obsidiana.
 * - Desktop: video full-bleed con zoom-out lento ligado al scroll.
 * - Móvil: el video 16:9 flota COMPLETO (sin recorte) en el vacío negro y hace
 *   parallax vertical al hacer scroll → inmersivo de gama alta, estilo keynote.
 * Entra con un revelado cinematográfico (clip-path) y arranca desde el inicio.
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
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]); // desktop zoom
  const y = useTransform(scrollYProgress, [0, 1], ['22%', '-22%']); // móvil parallax

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

  const motionStyle = reduce ? undefined : isDesktop ? { scale } : { y };

  return (
    <div ref={ref} className="relative w-full bg-obsidian h-[200vh] sm:h-[230vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <motion.video
          ref={videoRef}
          style={motionStyle}
          // Revelado cinematográfico "barras de cine": se abre desde el centro.
          initial={reduce ? false : { opacity: 0, clipPath: 'inset(46% 0% 46% 0%)' }}
          whileInView={reduce ? undefined : { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
          // Móvil: banda 16:9 completa, centrada. Desktop: full-bleed object-cover.
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

        {/* Atmósfera: vignette radial que profundiza el vacío negro alrededor */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(5,5,5,0.55)_100%)]" />
        {/* Funde los bordes superior e inferior con la obsidiana */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-obsidian to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian to-transparent" />
      </div>
    </div>
  );
}
