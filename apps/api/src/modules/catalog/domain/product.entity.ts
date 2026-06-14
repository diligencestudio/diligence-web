/**
 * Entidad de dominio (independiente de Mongoose y de la capa HTTP).
 * Representa un producto tal como lo entiende el negocio.
 */
export interface ProductImage {
  url: string;
  alt: string;
}

export type ProductSection = 'hombre' | 'mujer' | 'unisex';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceInCents: number;
  compareAtPriceInCents: number | null;
  currency: 'COP';
  images: ProductImage[];
  section: ProductSection;
  category: string;
  collection: string | null;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  isBasic: boolean;
  isBlank: boolean;
  onSale: boolean;
  active: boolean;
}
