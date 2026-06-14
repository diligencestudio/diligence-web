import type { CollectionDTO, ProductDTO } from '@diligence/contracts';
import type { Product } from '../domain/product.entity';
import type { Collection } from '../domain/collection.entity';

/**
 * Traduce entidades de dominio a los DTOs públicos del contrato compartido.
 * Mantiene la frontera: el cliente nunca ve campos internos (p.ej. `active`).
 */
export function toProductDTO(product: Product): ProductDTO {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    priceInCents: product.priceInCents,
    compareAtPriceInCents: product.compareAtPriceInCents,
    currency: product.currency,
    images: product.images,
    section: product.section,
    category: product.category,
    collection: product.collection,
    sizes: product.sizes,
    colors: product.colors,
    stock: product.stock,
    featured: product.featured,
    isBasic: product.isBasic,
    isBlank: product.isBlank,
    onSale: product.onSale,
  };
}

export function toCollectionDTO(collection: Collection): CollectionDTO {
  return {
    id: collection.id,
    slug: collection.slug,
    title: collection.title,
    description: collection.description,
    heroImage: collection.heroImage,
    order: collection.order,
  };
}
