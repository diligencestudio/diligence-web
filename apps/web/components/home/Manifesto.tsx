'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { MetalText } from '@diligence/ui';

const VALUES = ['Discipline', 'Ambition', 'Purpose', 'Diligence'];

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Sección manifiesto: comunica la "segunda capa" de la marca. La palabra
 * DILIGENCIA vive como sustrato gigante y casi invisible (la estructura que no
 * se ve); al frente, la tesis: lo visible en cromo, lo que sostiene en titanio.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.02, 0.07, 0.02]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden border-y border-gunmetal/40 bg-obsidian py-32 md:py-44"
    >
      {/* Sustrato: la palabra que no se ve, la diligencia bajo todo. */}
      <motion.span
        aria-hidden="true"
        style={{ x: reduce ? 0 : x, opacity: reduce ? 0.05 : ghostOpacity }}
        className="wordmark pointer-events-none absolute inset-0 flex select-none items-center justify-center whitespace-nowrap text-[26vw] leading-none text-chrome"
      >
        DILIGENCIA
      </motion.span>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.p
          className="text-[11px] uppercase tracking-[0.5em] text-titanium"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
        >
          La segunda capa
        </motion.p>

        <div className="mt-8 space-y-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease }}
          >
            <MetalText
              as="span"
              className="wordmark block text-2xl leading-tight md:text-5xl"
            >
              THE PLANS OF THE DILIGENT WILL PROSPER
            </MetalText>
          </motion.div>
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
