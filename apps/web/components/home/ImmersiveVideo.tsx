'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

/**
 * Reveal cinematográfico ligado al scroll. El video queda fijo (sticky) mientras
 * se hace zoom-out lento y la promesa de marca aparece y se desvanece al pasar.
 * Un solo momento orquestado — nada de efectos dispersos.
 */
export function ImmersiveVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Arranca el video desde el inicio la PRIMERA vez que entra en viewport
  // (no autoplay al cargar). Luego el atributo `loop` lo mantiene en bucle.
  const inView = useInView(videoRef, { amount: 0.4, once: true });
  useEffect(() => {
    const v = videoRef.current;
    if (inView && v) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
  }, [inView]);

  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.28, 0.62, 0.82],
    [0, 1, 1, 0],
  );
  const textY = useTransform(scrollYProgress, [0.08, 0.82], [50, -50]);
  const eyebrowOpacity = useTransform(scrollYProgress, [0.04, 0.18, 0.5, 0.62], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-[230vh] bg-obsidian">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <motion.video
          ref={videoRef}
          style={{ scale: reduce ? 1 : scale }}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
          poster="/brand/immersive-poster.jpg"
          aria-hidden="true"
        >
          <source src="https://res.cloudinary.com/dbedaf8ub/video/upload/v2_1_o7cfw9.mp4" type="video/mp4" />
        </motion.video>

        {/* Vignette: funde los bordes con la obsidiana + legibilidad del texto */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-obsidian to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-obsidian to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-obsidian/35" />

        {/* Promesa de marca revelada por scroll */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <motion.p
            style={{ opacity: reduce ? 1 : eyebrowOpacity }}
            className="mb-7 text-[11px] uppercase tracking-[0.5em] text-titanium"
          >
            La promesa
          </motion.p>
          <motion.h2
            style={{ opacity: reduce ? 1 : textOpacity, y: reduce ? 0 : textY }}
            className="wordmark text-2xl leading-snug text-pure md:text-4xl"
          >
            Cada prenda, una representación física del{' '}
            <span className="metal-text">poder</span>, la{' '}
            <span className="metal-text">disciplina</span> y la{' '}
            <span className="metal-text">ambición</span>.
          </motion.h2>
        </div>
      </div>
    </div>
  );
}
