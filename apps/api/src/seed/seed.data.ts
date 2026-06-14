/**
 * Datos demo de la marca DILIGENCE. Imágenes en escala de grises (picsum) para
 * respetar la estética monocromática mientras no haya fotografía de producto real.
 */
const img = (seed: string, alt: string) => ({
  url: `https://picsum.photos/seed/${seed}/900/1200?grayscale`,
  alt,
});

export const collectionsSeed = [
  {
    slug: 'obsidian',
    title: 'OBSIDIAN',
    description: 'La línea insignia. Negro absoluto, cortes arquitectónicos.',
    heroImage: `https://picsum.photos/seed/obsidian-hero/1920/1080?grayscale`,
    order: 1,
  },
  {
    slug: 'chrome',
    title: 'CHROME',
    description: 'Detalles metálicos y acabados plata sobre base gunmetal.',
    heroImage: `https://picsum.photos/seed/chrome-hero/1920/1080?grayscale`,
    order: 2,
  },
  {
    slug: 'essentials',
    title: 'ESSENTIALS',
    description: 'Básicos de peso premium. La base de todo guardarropa DILIGENCE.',
    heroImage: `https://picsum.photos/seed/essentials-hero/1920/1080?grayscale`,
    order: 3,
  },
];

interface SeedProduct {
  slug: string;
  name: string;
  description: string;
  priceInCents: number;
  compareAtPriceInCents?: number | null;
  currency: 'COP';
  images: { url: string; alt: string }[];
  section: 'hombre' | 'mujer' | 'unisex';
  category: string;
  collection: string | null;
  sizes: string[];
  colors: string[];
  stock: number;
  featured?: boolean;
  isBasic?: boolean;
  isBlank?: boolean;
  onSale?: boolean;
  active: boolean;
}

const product = (p: SeedProduct) => ({
  compareAtPriceInCents: null,
  featured: false,
  isBasic: false,
  isBlank: false,
  onSale: false,
  ...p,
});

export const productsSeed = [
  // ─── HOMBRE ──────────────────────────────────────────────────────────────
  product({
    slug: 'obsidian-heavy-hoodie',
    name: 'Obsidian Heavy Hoodie',
    description:
      'Hoodie de 480 g/m² en algodón orgánico tintado en negro obsidiana. Caída oversize, capucha doble.',
    priceInCents: 32900000,
    currency: 'COP',
    images: [img('obsidian-hoodie-1', 'Obsidian Heavy Hoodie frente'), img('obsidian-hoodie-2', 'Obsidian Heavy Hoodie espalda')],
    section: 'hombre',
    category: 'hoodies',
    collection: 'obsidian',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black'],
    stock: 40,
    featured: true,
    active: true,
  }),
  product({
    slug: 'gunmetal-cargo-pant',
    name: 'Gunmetal Cargo Pant',
    description: 'Pantalón cargo de sarga gunmetal con herrajes metalizados y corte tapered.',
    priceInCents: 28900000,
    currency: 'COP',
    images: [img('gunmetal-cargo-1', 'Gunmetal Cargo Pant'), img('gunmetal-cargo-2', 'Gunmetal Cargo Pant detalle')],
    section: 'hombre',
    category: 'pants',
    collection: 'chrome',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Gunmetal'],
    stock: 30,
    featured: true,
    active: true,
  }),
  product({
    slug: 'chrome-bomber-jacket',
    name: 'Chrome Bomber Jacket',
    description: 'Bomber con acabado cromo cepillado y forro graphite. Edición limitada.',
    priceInCents: 43900000,
    compareAtPriceInCents: 54900000,
    currency: 'COP',
    images: [img('chrome-bomber-1', 'Chrome Bomber Jacket'), img('chrome-bomber-2', 'Chrome Bomber Jacket detalle')],
    section: 'hombre',
    category: 'outerwear',
    collection: 'chrome',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Chrome Silver', 'Graphite'],
    stock: 15,
    featured: true,
    onSale: true,
    active: true,
  }),
  product({
    slug: 'graphite-denim',
    name: 'Graphite Denim',
    description: 'Jean de 13.5 oz en lavado graphite, silueta recta moderna.',
    priceInCents: 33900000,
    currency: 'COP',
    images: [img('graphite-denim-1', 'Graphite Denim'), img('graphite-denim-2', 'Graphite Denim detalle')],
    section: 'hombre',
    category: 'denim',
    collection: 'obsidian',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Graphite'],
    stock: 50,
    active: true,
  }),

  // ─── MUJER ───────────────────────────────────────────────────────────────
  product({
    slug: 'obsidian-corset-top',
    name: 'Obsidian Corset Top',
    description: 'Top corsetería estructurada en obsidiana, ballenas internas y cierre posterior.',
    priceInCents: 24900000,
    currency: 'COP',
    images: [img('obsidian-corset-1', 'Obsidian Corset Top'), img('obsidian-corset-2', 'Obsidian Corset Top detalle')],
    section: 'mujer',
    category: 'tops',
    collection: 'obsidian',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Obsidian Black'],
    stock: 35,
    featured: true,
    active: true,
  }),
  product({
    slug: 'chrome-slip-dress',
    name: 'Chrome Slip Dress',
    description: 'Vestido slip en satén con reflejo cromo. Caída fluida al bies.',
    priceInCents: 38900000,
    currency: 'COP',
    images: [img('chrome-slip-1', 'Chrome Slip Dress'), img('chrome-slip-2', 'Chrome Slip Dress detalle')],
    section: 'mujer',
    category: 'dresses',
    collection: 'chrome',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Chrome Silver'],
    stock: 22,
    featured: true,
    active: true,
  }),
  product({
    slug: 'graphite-wide-pant',
    name: 'Graphite Wide Pant',
    description: 'Pantalón palazzo de talle alto en graphite, caída amplia.',
    priceInCents: 29900000,
    compareAtPriceInCents: 35900000,
    currency: 'COP',
    images: [img('graphite-wide-1', 'Graphite Wide Pant'), img('graphite-wide-2', 'Graphite Wide Pant detalle')],
    section: 'mujer',
    category: 'pants',
    collection: 'obsidian',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Graphite'],
    stock: 28,
    onSale: true,
    active: true,
  }),

  // ─── ESSENTIALS / BÁSICOS (unisex) ─────────────────────────────────────────
  product({
    slug: 'titanium-tee',
    name: 'Titanium Tee',
    description: 'Camiseta de algodón peinado 220 g/m² en gris titanio. Cuello reforzado.',
    priceInCents: 14900000,
    currency: 'COP',
    images: [img('titanium-tee-1', 'Titanium Tee'), img('titanium-tee-2', 'Titanium Tee detalle')],
    section: 'unisex',
    category: 'tees',
    collection: 'essentials',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Titanium', 'Obsidian Black', 'Pure White'],
    stock: 120,
    featured: true,
    isBasic: true,
    active: true,
  }),
  product({
    slug: 'midnight-crewneck',
    name: 'Midnight Crewneck',
    description: 'Buzo crewneck de felpa premium en midnight graphite.',
    priceInCents: 25900000,
    currency: 'COP',
    images: [img('midnight-crew-1', 'Midnight Crewneck'), img('midnight-crew-2', 'Midnight Crewneck detalle')],
    section: 'unisex',
    category: 'sweaters',
    collection: 'essentials',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Graphite', 'Obsidian Black'],
    stock: 60,
    featured: true,
    isBasic: true,
    active: true,
  }),
  product({
    slug: 'silver-monogram-cap',
    name: 'Silver Monogram Cap',
    description: 'Gorra estructurada con monograma D⁄G bordado en hilo plata.',
    priceInCents: 11900000,
    currency: 'COP',
    images: [img('silver-cap-1', 'Silver Monogram Cap'), img('silver-cap-2', 'Silver Monogram Cap detalle')],
    section: 'unisex',
    category: 'accessories',
    collection: 'chrome',
    sizes: ['Única'],
    colors: ['Obsidian Black'],
    stock: 80,
    active: true,
  }),

  // ─── BLANKS (prendas sin estampar, unisex) ──────────────────────────────────
  product({
    slug: 'pure-white-tee-blank',
    name: 'Pure White Tee — Blank',
    description: 'Camiseta esencial sin estampar en blanco puro, algodón pima 200 g/m². Lista para personalizar.',
    priceInCents: 13900000,
    currency: 'COP',
    images: [img('pure-white-blank-1', 'Pure White Tee Blank'), img('pure-white-blank-2', 'Pure White Tee Blank detalle')],
    section: 'unisex',
    category: 'tees',
    collection: 'essentials',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pure White'],
    stock: 200,
    isBasic: true,
    isBlank: true,
    active: true,
  }),
  product({
    slug: 'obsidian-hoodie-blank',
    name: 'Obsidian Hoodie — Blank',
    description: 'Hoodie base sin estampar en obsidiana, 400 g/m². Ideal para bordado o serigrafía.',
    priceInCents: 26900000,
    currency: 'COP',
    images: [img('obsidian-hoodie-blank-1', 'Obsidian Hoodie Blank'), img('obsidian-hoodie-blank-2', 'Obsidian Hoodie Blank detalle')],
    section: 'unisex',
    category: 'hoodies',
    collection: null,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black', 'Graphite'],
    stock: 150,
    isBlank: true,
    active: true,
  }),
];
