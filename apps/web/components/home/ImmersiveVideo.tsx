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
 * Reveal cinematográfico ligado al scroll, SIN texto superpuesto. El video queda
 * fijo (sticky) mientras se hace un zoom-out lento al hacer scroll. Arranca desde
 * el inicio la primera vez que entra en viewport y luego queda en bucle.
 */
// En desarrollo usa el archivo local; en producción, la URL del CDN (Cloudinary).
// Los .mp4 grandes NO se versionan en git — se sirven desde el CDN.
const VIDEO_SRC =
  process.env.NEXT_PUBLIC_IMMERSIVE_VIDEO_URL || '/brand/immersive.mp4';

export function ImmersiveVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);

  const inView = useInView(videoRef, { amount: 0.4, once: true });
  useEffect(() => {
    const v = videoRef.current;
    if (inView && v) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
  }, [inView]);

  return (
    <div ref={ref} className="relative h-[230vh] bg-obsidian">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
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
          <source src={VIDEO_SRC} type="video/mp4" />
        </motion.video>

        {/* Funde los bordes con la obsidiana (sin velo ni texto) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-obsidian to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />
      </div>
    </div>
  );
}
