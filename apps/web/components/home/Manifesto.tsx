'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { MetalText } from '@diligence/ui';

// Diligence queda fuera a propósito: es la marca misma, está implícita en todo.
const VALUES = ['Discipline', 'Ambition', 'Purpose'];

/* La tesis se parte en renglones de largo desigual (rombo: corto/largo/corto)
   para romper el bloque rectangular que formaba la frase corrida. */
const THESIS = [
  { text: 'THE PLANS', className: 'text-xl md:text-4xl' },
  { text: 'OF THE DILIGENT', className: 'text-2xl md:text-5xl' },
  { text: 'WILL PROSPER', className: 'text-xl md:text-4xl' },
];

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Estrella guía: elemento visual de la marca. Cuatro puntas curvas (sparkle)
 * sobre una cruz fina, en trazos cromados. Se dibuja en un viewBox centrado
 * en 0,0 para poder rotarla desde su centro.
 */
function GuidingStar({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="-110 -110 220 220"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Puntas diagonales secundarias, más cortas */}
      <path
        d="M0 -46 C3 -14 14 -3 46 0 C14 3 3 14 0 46 C-3 14 -14 3 -46 0 C-14 -3 -3 -14 0 -46 Z"
        fill="currentColor"
        opacity="0.55"
        transform="rotate(45)"
      />
      {/* Cuerpo principal: estrella de 4 puntas alargadas */}
      <path
        d="M0 -104 C4 -30 30 -4 104 0 C30 4 4 30 0 104 C-4 30 -30 4 -104 0 C-30 -4 -4 -30 0 -104 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Sección manifiesto: comunica la segunda capa de la marca. La estrella guía
 * vive como sustrato casi invisible (el norte que orienta sin mostrarse);
 * al frente, la tesis: lo visible en cromo, lo que sostiene en titanio.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.04, 0.11, 0.04]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden border-y border-gunmetal/40 bg-obsidian py-32 md:py-44"
    >
      {/* Sustrato: la estrella guía, el norte bajo todo. */}
      <motion.div
        aria-hidden="true"
        style={{ rotate: reduce ? 0 : rotate, opacity: reduce ? 0.08 : ghostOpacity }}
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-chrome"
      >
        <GuidingStar className="w-[80%] max-w-[520px]" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <div className="space-y-1">
          {THESIS.map((line, i) => (
            <motion.div
              key={line.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.12, ease }}
            >
              <MetalText
                as="span"
                className={`wordmark block whitespace-nowrap leading-tight ${line.className}`}
              >
                {line.text}
              </MetalText>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mx-auto mt-12 h-px w-16 bg-titanium/40"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        />

        <motion.p
          className="mx-auto mt-12 max-w-xl text-sm leading-relaxed text-titanium md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.4, ease }}
        >
          El éxito, el poder y el estatus no son producto del azar, sino el
          resultado de ambición, disciplina constante y un propósito
          inquebrantable. Es un recordatorio de que todo aquello que se
          construye con diligencia está destinado a prosperar.
        </motion.p>

        <motion.ul
          className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.3em] text-titanium/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.55, ease }}
        >
          {VALUES.map((v, i) => (
            <li key={v} className="flex items-center gap-4">
              {i > 0 && <span className="text-titanium/30">·</span>}
              {v}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
