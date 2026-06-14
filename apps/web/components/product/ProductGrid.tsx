import type { ProductDTO } from '@diligence/contracts';
import { ProductCard } from './ProductCard';
import { Reveal } from '@/components/Reveal';

export function ProductGrid({ products }: { products: ProductDTO[] }) {
  if (products.length === 0) {
    return (
      <p className="py-24 text-center text-sm text-titanium">
        No hay productos disponibles por ahora.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <Reveal key={product.id} delay={(i % 4) * 0.06}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
