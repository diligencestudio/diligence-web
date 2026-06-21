interface LogoChromeProps {
  /** Ancho en px del logo. */
  width?: number;
  className?: string;
  /** Muestra el wordmark "DILIGENCE" debajo del monograma. */
  withWordmark?: boolean;
}

/**
 * Lockup de marca: monograma D⁄G en video metálico animado (loop perpetuo) +
 * wordmark opcional. El video se mezcla en `lighten` para fundir su fondo negro
 * con la obsidiana del footer y parecer una animación nativa, sin contenedor.
 * Estilos en `.logo-video` (globals.css).
 */
export function LogoChrome({
  width = 260,
  className = '',
  withWordmark = false,
}: LogoChromeProps) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <video
        className="logo-video"
        style={{ width }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-hidden="true"
      >
        <source
          src={process.env.NEXT_PUBLIC_LOGO_VIDEO_URL || '/brand/diligence-logo.mp4'}
          type="video/mp4"
        />
      </video>
      {withWordmark && (
        <span className="metal-text wordmark -mt-1 text-sm">DILIGENCE</span>
      )}
    </span>
  );
}
