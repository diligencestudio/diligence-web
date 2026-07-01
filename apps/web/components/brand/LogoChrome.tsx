"use client";

import { useEffect, useRef } from "react";

interface LogoChromeProps {
  /** Ancho del logo: px (number) o cualquier valor CSS (p.ej. 'clamp(...)'). */
  width?: number | string;
  className?: string;
}

// El video fuente dura 8s y pasa de plata/azul a un grado dorado a partir de ~3.5s,
// antes de desarmarse. Recortamos (crop + trim) para quedarnos solo con el monograma
// —sin el wordmark "DILIGENCE" horneado debajo— y solo con el tramo plata/azul.
const LOOP_START = 0.05;
const LOOP_END = 3.3;

/**
 * Lockup de marca: monograma D⁄G en video metálico animado (plata/azul).
 * El video se mezcla en `lighten` para fundir su fondo negro con la obsidiana del
 * footer y parecer una animación nativa, sin contenedor. Estilos en `.logo-video`.
 *
 * El loop se controla por JS (no por el atributo `loop`) para reiniciar en `LOOP_END`
 * y nunca mostrar el tramo final donde el grado vira a dorado.
 */
export function LogoChrome({ width = 260, className = "" }: LogoChromeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    const tick = () => {
      // Reiniciamos en cuanto el logo está completo, antes del desvanecimiento (~7s).
      if (video.currentTime >= LOOP_END) {
        video.currentTime = LOOP_START;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Red de seguridad: si por lo que sea el video llega a su final, lo reanudamos.
    const handleEnded = () => {
      video.currentTime = LOOP_START;
      void video.play();
    };
    video.addEventListener("ended", handleEnded);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <video
        ref={videoRef}
        className="logo-video"
        style={{ width }}
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-hidden="true"
      >
        <source
          src={
            process.env.NEXT_PUBLIC_LOGO_VIDEO_URL ||
            "/brand/diligence-monogram-silver.mp4"
          }
          type="video/mp4"
        />
      </video>
    </span>
  );
}
