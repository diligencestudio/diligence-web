import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import type { CollectionDTO } from '@diligence/contracts';
import { api } from '@/lib/api';
import { MetalText } from '@diligence/ui';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Colecciones',
  description: 'Las colecciones de DILIGENCE: Realization, Chrome y Essentials.',
};

export default async function ColeccionesPage() {
  let collections: CollectionDTO[] = [];
  try {
    collections = await api.listCollections();
  } catch {
    collections = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <Reveal className="mb-14 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-titanium">Editorial</p>
        <MetalText as="h1" className="mt-3 wordmark text-4xl md:text-5xl">
          Colecciones
        </MetalText>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {collections.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08}>
            <Link
              href={`/coleccion/${c.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden bg-gunmetal"
            >
              {c.heroImage && (
                <Image
                  src={c.heroImage}
                  alt={c.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/30 px-6 text-center">
                <MetalText className="wordmark text-2xl">{c.title}</MetalText>
                {c.description && (
                  <p className="mt-3 max-w-xs text-xs text-chrome/80">{c.description}</p>
                )}
                <span className="mt-5 text-[11px] uppercase tracking-[0.3em] text-chrome">
                  Ver colección
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
