import type { ProductDTO } from '@diligence/contracts';
import { MetalText } from '@diligence/ui';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Reveal } from '@/components/Reveal';

interface CatalogViewProps {
  eyebrow: string;
  title: string;
  description?: string;
  products: ProductDTO[];
}

/** Cabecera + grid reutilizable para todas las páginas de listado (PLP). */
export function CatalogView({ eyebrow, title, description, products }: CatalogViewProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <Reveal className="mb-14 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-titanium">{eyebrow}</p>
        <MetalText as="h1" className="mt-3 wordmark text-4xl md:text-5xl">
          {title}
        </MetalText>
        {description && (
          <p className="mx-auto mt-5 max-w-md text-sm text-titanium">{description}</p>
        )}
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-titanium/50">
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
        </p>
      </Reveal>
      <ProductGrid products={products} />
    </div>
  );
}

/** Carga segura: devuelve [] si la API no responde. */
export async function safeProducts(
  fetcher: () => Promise<{ items: ProductDTO[] }>,
): Promise<ProductDTO[]> {
  try {
    return (await fetcher()).items;
  } catch {
    return [];
  }
}
