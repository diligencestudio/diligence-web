import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CatalogView, safeProducts } from '@/components/catalog/CatalogView';

export const metadata: Metadata = {
  title: 'Hombre',
  description: 'Colección Hombre de DILIGENCE.',
};

export default async function HombrePage() {
  const products = await safeProducts(() => api.listProducts({ section: 'hombre', limit: '100' }));
  return <CatalogView eyebrow="Sección" title="Hombre" products={products} />;
}
