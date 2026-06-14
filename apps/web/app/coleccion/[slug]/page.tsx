import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CollectionDTO } from '@diligence/contracts';
import { api } from '@/lib/api';
import { ProductGrid } from '@/components/product/ProductGrid';
import { MetalText } from '@diligence/ui';
import { Reveal } from '@/components/Reveal';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const collection = await api.getCollection(slug);
    return { title: collection.title, description: collection.description };
  } catch {
    return { title: 'Colección' };
  }
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;

  let collection: CollectionDTO;
  try {
    collection = await api.getCollection(slug);
  } catch {
    notFound();
  }

  const products = (await api.listProducts({ collection: slug, limit: '100' })).items;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <Reveal className="mb-14 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-titanium">
          Colección
        </p>
        <MetalText as="h1" className="mt-3 wordmark text-4xl md:text-5xl">
          {collection.title}
        </MetalText>
        {collection.description && (
          <p className="mx-auto mt-5 max-w-md text-sm text-titanium">
            {collection.description}
          </p>
        )}
      </Reveal>
      <ProductGrid products={products} />
    </div>
  );
}
