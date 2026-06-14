'use client';

import { useState, type CSSProperties } from 'react';

interface LogoLockupProps {
  /** Ruta a la imagen del logo ya renderizado (webp/png). */
  src: string;
  /** Texto accesible. */
  label?: string;
  /** Ancho en px del logo. */
  width?: number;
  /** Aspect-ratio de la imagen (coincide con su tamaño real). */
  aspectRatio?: string;
  /** Control de pausa/play (estilo apple.com). */
  showToggle?: boolean;
  className?: string;
}

/**
 * Hero del logo para un asset YA renderizado (render 3D metálico sobre negro).
 * A diferencia de LogoSweep (silueta SVG plana), aquí se muestra la imagen real
 * y el barrido de luz pasa por encima, recortado a la luminancia del metal.
 * El fondo rectangular se difumina hacia los bordes para fundirse con la página.
 */
export function LogoLockup({
  src,
  label = 'DILIGENCE',
  width = 420,
  aspectRatio = '3 / 2',
  showToggle = true,
  className = '',
}: LogoLockupProps) {
  const [paused, setPaused] = useState(false);

  const style = {
    '--logo-src': `url("${src}")`,
    '--logo-w': `${width}px`,
    '--logo-ar': aspectRatio,
  } as CSSProperties;

  return (
    <div className={`logo-lockup ${className}`} data-paused={paused} style={style}>
      <span className="logo-glow" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo-lockup-img" src={src} alt={label} fetchPriority="high" />
      <span className="logo-lockup-shine" aria-hidden="true" />
      {showToggle && (
        <button
          type="button"
          className="logo-toggle"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Reproducir animación' : 'Pausar animación'}
        >
          {paused ? '▶' : '❚❚'}
        </button>
      )}
    </div>
  );
}
