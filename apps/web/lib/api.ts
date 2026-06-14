import type {
  CollectionDTO,
  ProductDTO,
  CreateCheckoutInput,
  CheckoutSessionDTO,
  OrderDTO,
} from '@diligence/contracts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface ListResponse<T> {
  items: T[];
  total: number;
}

// Catálogo y órdenes se leen siempre frescos (stock, sale y precios en vivo).
// Esto hace que las páginas de listado sean dinámicas (server-rendered on demand)
// en lugar de prerenderizarse en el build.
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`API ${path} respondió ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listProducts: (query: Record<string, string> = {}) => {
    const qs = new URLSearchParams(query).toString();
    return get<ListResponse<ProductDTO>>(`/products${qs ? `?${qs}` : ''}`);
  },
  getProduct: (slug: string) => get<ProductDTO>(`/products/${slug}`),
  listCollections: () => get<CollectionDTO[]>('/collections'),
  getCollection: (slug: string) => get<CollectionDTO>(`/collections/${slug}`),

  createCheckout: async (input: CreateCheckoutInput): Promise<CheckoutSessionDTO> => {
    const res = await fetch(`${API_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`Checkout falló: ${res.status}`);
    return res.json() as Promise<CheckoutSessionDTO>;
  },

  getOrder: (id: string) => get<OrderDTO>(`/orders/${id}`),
};
