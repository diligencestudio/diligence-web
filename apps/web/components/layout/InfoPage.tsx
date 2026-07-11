import type { ReactNode } from 'react';
import { MetalText } from '@diligence/ui';

/**
 * Layout compartido de las páginas informativas (envíos, devoluciones,
 * contacto, legales): cabecera editorial centrada + secciones en prosa.
 */
export function InfoPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <header className="mb-14 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-titanium">
          {eyebrow}
        </p>
        <MetalText as="h1" className="mt-3 wordmark text-4xl md:text-5xl">
          {title}
        </MetalText>
      </header>
      <div className="space-y-10">{children}</div>
    </div>
  );
}

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-[11px] uppercase tracking-[0.25em] text-chrome">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-titanium">
        {children}
      </div>
    </section>
  );
}
