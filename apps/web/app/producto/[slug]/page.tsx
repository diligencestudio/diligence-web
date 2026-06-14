import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { ProductDTO } from '@diligence/contracts';
import { api } from '@/lib/api';
import { formatCOP } from '@/lib/format';
import { AddToCart } from '@/components/product/AddToCart';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await api.getProduct(slug);
    return {
      title: product.name,
      description: product.description,
      openGraph: { images: product.images[0]?.url ? [product.images[0].url] : [] },
    };
  } catch {
    return { title: 'Producto' };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product: ProductDTO;
  try {
    product = await api.getProduct(slug);
  } catch {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: { '@type': 'Brand', name: 'DILIGENCE' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'COP',
      price: (product.priceInCents / 100).toFixed(0),
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-12 md:grid-cols-2">
        {/* Galería */}
        <div className="grid gap-4">
          {product.images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] overflow-hidden bg-gunmetal"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Detalle */}
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-[11px] uppercase tracking-[0.3em] text-titanium">
            {product.category}
          </p>
          <h1 className="mt-3 wordmark text-3xl text-pure">{product.name}</h1>
          <p className="mt-4 text-xl text-chrome">{formatCOP(product.priceInCents)}</p>
          <p className="mt-6 text-sm leading-relaxed text-titanium">
            {product.description}
          </p>
          <div className="mt-10">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
