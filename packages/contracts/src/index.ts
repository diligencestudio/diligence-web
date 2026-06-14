/**
 * Contratos compartidos entre el storefront (web) y la API (api).
 * Solo tipos + constantes de dominio: ninguna dependencia de framework.
 */

// ─── Catálogo ───────────────────────────────────────────────────────────────

export type Currency = "COP";

/** Sección de tienda a la que pertenece el producto. */
export type ProductSection = "hombre" | "mujer" | "unisex";

export const PRODUCT_SECTIONS: ProductSection[] = ["hombre", "mujer", "unisex"];

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceInCents: number;
  /** Precio anterior (tachado) cuando el producto está en sale. */
  compareAtPriceInCents: number | null;
  currency: Currency;
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
}

export interface CollectionDTO {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string | null;
  order: number;
}

// ─── Órdenes / Checkout ──────────────────────────────────────────────────────

export const OrderStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DECLINED: "DECLINED",
  VOIDED: "VOIDED",
  ERROR: "ERROR",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderItemDTO {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  priceInCents: number;
  size?: string;
  color?: string;
}

export interface CustomerDTO {
  fullName: string;
  email: string;
  phone: string;
}

export interface OrderDTO {
  id: string;
  reference: string;
  items: OrderItemDTO[];
  amountInCents: number;
  currency: Currency;
  status: OrderStatus;
  customer: CustomerDTO;
  wompiTransactionId: string | null;
  createdAt: string;
}

// Payload que el front envía para iniciar checkout.
export interface CheckoutItemInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CreateCheckoutInput {
  items: CheckoutItemInput[];
  customer: CustomerDTO;
}

// Datos que el front necesita para lanzar el Web Checkout de Wompi.
export interface CheckoutSessionDTO {
  orderId: string;
  reference: string;
  amountInCents: number;
  currency: Currency;
  publicKey: string;
  integritySignature: string;
  checkoutUrl: string;
  redirectUrl: string;
}

// ─── Respuestas API ───────────────────────────────────────────────────────────

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}
