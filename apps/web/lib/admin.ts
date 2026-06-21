'use client';

import type { CollectionDTO, ProductDTO } from '@diligence/contracts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = 'diligence-admin-token';

export const token = {
  get: () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function authed<T>(path: string, init: RequestInit = {}): Promise<T> {
  const t = token.get();
  const res = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 401) {
    token.clear();
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
    throw new Error('Sesión expirada');
  }
  if (!res.ok) {
    const msg = await res.json().catch(() => ({}));
    throw new Error(
      Array.isArray(msg.message) ? msg.message.join(', ') : msg.message || `Error ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

export const adminApi = {
  login: async (email: string, password: string): Promise<string> => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Credenciales incorrectas');
    const data = (await res.json()) as { token: string };
    token.set(data.token);
    return data.token;
  },

  // Productos
  listProducts: () => authed<ProductDTO[]>('/admin/products'),
  createProduct: (body: Record<string, unknown>) =>
    authed<ProductDTO>('/admin/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: string, body: Record<string, unknown>) =>
    authed<ProductDTO>(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProduct: (id: string) =>
    authed<{ deleted: boolean }>(`/admin/products/${id}`, { method: 'DELETE' }),

  // Colecciones
  listCollections: () => authed<CollectionDTO[]>('/admin/collections'),
  createCollection: (body: Record<string, unknown>) =>
    authed<CollectionDTO>('/admin/collections', { method: 'POST', body: JSON.stringify(body) }),
  updateCollection: (id: string, body: Record<string, unknown>) =>
    authed<CollectionDTO>(`/admin/collections/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteCollection: (id: string) =>
    authed<{ deleted: boolean }>(`/admin/collections/${id}`, { method: 'DELETE' }),

  // Subida de imagen → devuelve la URL de Cloudinary
  uploadImage: async (file: File): Promise<string> => {
    const t = token.get();
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_URL}/api/uploads/image`, {
      method: 'POST',
      headers: t ? { Authorization: `Bearer ${t}` } : undefined,
      body: form,
    });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      throw new Error(msg.message || 'No se pudo subir la imagen');
    }
    const data = (await res.json()) as { url: string };
    return data.url;
  },
};
