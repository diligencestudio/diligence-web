import type { Metadata } from 'next';
import type { ProductDTO } from '@diligence/contracts';
import { api } from '@/lib/api';
import { ProductGrid } from '@/components/product/ProductGrid';
import { MetalText } from '@diligence/ui';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Tienda',
  description: 'Todo el catálogo DILIGENCE.',
};

export default async function TiendaPage() {
  let products: ProductDTO[] = [];
  try {
    products = (await api.listProducts({ limit: '100' })).items;
  } catch {
    products = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <Reveal className="mb-14 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-titanium">
          Catálogo completo
        </p>
        <MetalText as="h1" className="mt-3 wordmark text-4xl md:text-5xl">
          Tienda
        </MetalText>
      </Reveal>
      <ProductGrid products={products} />
    </div>
  );
}
