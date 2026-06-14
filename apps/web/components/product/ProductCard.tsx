import Image from 'next/image';
import Link from 'next/link';
import type { ProductDTO } from '@diligence/contracts';
import { formatCOP } from '@/lib/format';

export function ProductCard({ product }: { product: ProductDTO }) {
  const image = product.images[0];
  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-gunmetal">
        {image && (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {product.onSale && (
          <span className="absolute left-3 top-3 bg-pure px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-obsidian">
            Sale
          </span>
        )}
        {product.isBlank && (
          <span className="absolute right-3 top-3 border border-chrome/60 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-chrome">
            Blank
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm text-pure">{product.name}</h3>
          <p className="text-[11px] uppercase tracking-[0.2em] text-titanium">
            {product.category}
          </p>
        </div>
        <span className="flex flex-col items-end">
          <span className="text-sm text-chrome">{formatCOP(product.priceInCents)}</span>
          {product.compareAtPriceInCents && (
            <span className="text-[11px] text-titanium/60 line-through">
              {formatCOP(product.compareAtPriceInCents)}
            </span>
          )}
        </span>
      </div>
    </Link>
  );
}
