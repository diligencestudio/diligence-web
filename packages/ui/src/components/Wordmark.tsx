import { MetalText } from './MetalText';

interface WordmarkProps {
  /** Muestra el monograma D⁄G encima del wordmark. */
  withMonogram?: boolean;
  className?: string;
}

/**
 * Identidad tipográfica de DILIGENCE: monograma D⁄G + wordmark con tracking amplio.
 * Sustituto tipográfico hasta integrar el logo vectorial real de la marca.
 */
export function Wordmark({ withMonogram = false, className = '' }: WordmarkProps) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      {withMonogram && (
        <MetalText className="text-4xl leading-none wordmark tracking-tight">D⁄G</MetalText>
      )}
      <MetalText className="wordmark text-sm">DILIGENCE</MetalText>
    </span>
  );
}
