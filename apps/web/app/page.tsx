import Link from 'next/link';
import Image from 'next/image';
import type { CollectionDTO, ProductDTO } from '@diligence/contracts';
import { api } from '@/lib/api';
import { Hero } from '@/components/home/Hero';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Reveal } from '@/components/Reveal';
import { MetalText } from '@diligence/ui';

async function getData(): Promise<{
  featured: ProductDTO[];
  collections: CollectionDTO[];
}> {
  try {
    const [featured, collections] = await Promise.all([
      api.listProducts({ featured: 'true', limit: '8' }),
      api.listCollections(),
    ]);
    return { featured: featured.items, collections };
  } catch {
    return { featured: [], collections: [] };
  }
}

export default async function HomePage() {
  const { featured, collections } = await getData();

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal className="mb-14 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-titanium">
            Selección
          </p>
          <MetalText as="h2" className="mt-3 wordmark text-3xl md:text-4xl">
            Destacados
          </MetalText>
        </Reveal>
        <ProductGrid products={featured} />
      </section>

      {collections.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/30">
                    <MetalText className="wordmark text-2xl">{c.title}</MetalText>
                    <span className="mt-3 text-[11px] uppercase tracking-[0.3em] text-chrome">
                      Ver colección
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
