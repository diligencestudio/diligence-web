"use client";

import { useEffect, useRef } from "react";

interface LogoChromeProps {
  /** Ancho del logo: px (number) o cualquier valor CSS (p.ej. 'clamp(...)'). */
  width?: number | string;
  className?: string;
  /** Muestra el wordmark "DILIGENCE" debajo del monograma. */
  withWordmark?: boolean;
}

// El video dura 8s, pero el ciclo útil es: armado del monograma + "escritura" del
// wordmark "DILIGENCE" (~0–4s) y el logo completo en metal (~4–6.9s). A partir de
// ~7s el video desarma/borra las letras de forma abrupta y reinicia el wordmark a
// medias (frame ~7.9s: una "D" suelta), lo que se veía feo con el loop nativo de 8s.
// Recortamos el loop justo antes de ese desvanecimiento: armado → completo → reinicio.
const LOOP_START = 0.05;
const LOOP_END = 7.7;

/**
 * Lockup de marca: monograma D⁄G en video metálico animado + wordmark opcional.
 * El video se mezcla en `lighten` para fundir su fondo negro con la obsidiana del
 * footer y parecer una animación nativa, sin contenedor. Estilos en `.logo-video`.
 *
 * El loop se controla por JS (no por el atributo `loop`) para reiniciar en `LOOP_END`
 * y nunca mostrar el tramo final donde el video borra las letras a medias.
 */
export function LogoChrome({
  width = 260,
  className = "",
  withWordmark = false,
}: LogoChromeProps) {
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
            "/brand/diligence-logo.mp4"
          }
          type="video/mp4"
        />
      </video>
      {withWordmark && (
        <span className="metal-text wordmark -mt-1 text-sm">DILIGENCE</span>
      )}
    </span>
  );
}
