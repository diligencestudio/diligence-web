import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { CatalogView, safeProducts } from '@/components/catalog/CatalogView';

export const metadata: Metadata = {
  title: 'Sale',
  description: 'Selección con precio especial por tiempo limitado.',
};

export default async function SalePage() {
  const products = await safeProducts(() => api.listProducts({ sale: 'true', limit: '100' }));
  return (
    <CatalogView
      eyebrow="Tiempo limitado"
      title="Sale"
      description="Piezas seleccionadas con precio especial mientras dure el inventario."
      products={products}
    />
  );
}
