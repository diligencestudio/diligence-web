import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CatalogView, safeProducts } from '@/components/catalog/CatalogView';

export const metadata: Metadata = {
  title: 'Mujer',
  description: 'Colección Mujer de DILIGENCE.',
};

export default async function MujerPage() {
  const products = await safeProducts(() => api.listProducts({ section: 'mujer', limit: '100' }));
  return (
    <CatalogView
      eyebrow="Sección"
      title="Mujer"
      description="Presencia y precisión. La línea femenina de DILIGENCE."
      products={products}
    />
  );
}
