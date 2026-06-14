import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CatalogView, safeProducts } from '@/components/catalog/CatalogView';

export const metadata: Metadata = {
  title: 'Blanks',
  description: 'Prendas base sin estampar, listas para personalizar.',
};

export default async function BlanksPage() {
  const products = await safeProducts(() => api.listProducts({ blank: 'true', limit: '100' }));
  return (
    <CatalogView
      eyebrow="Sin estampar"
      title="Blanks"
      description="Prendas base de calidad superior, listas para bordado o serigrafía."
      products={products}
    />
  );
}
