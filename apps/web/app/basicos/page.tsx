import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CatalogView, safeProducts } from '@/components/catalog/CatalogView';

export const metadata: Metadata = {
  title: 'Básicos',
  description: 'Esenciales de peso premium. La base del guardarropa DILIGENCE.',
};

export default async function BasicosPage() {
  const products = await safeProducts(() => api.listProducts({ basic: 'true', limit: '100' }));
  return (
    <CatalogView
      eyebrow="Esenciales"
      title="Básicos"
      description="Prendas de peso premium pensadas para usarse todos los días."
      products={products}
    />
  );
}
