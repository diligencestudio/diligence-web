'use client';

import type {
  AccountDTO,
  AuthResponse,
  OrderDTO,
  RegisterInput,
} from '@diligence/contracts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = 'diligence-account-token';

export const accountToken = {
  get: () =>
    typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

function parseError(msg: { message?: string | string[] }): string {
  if (Array.isArray(msg.message)) return msg.message.join(', ');
  return msg.message || 'Ocurrió un error';
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(parseError(await res.json().catch(() => ({}))));
  return res.json() as Promise<T>;
}

async function authed<T>(path: string, init: RequestInit = {}): Promise<T> {
  const t = accountToken.get();
  const res = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 401) {
    accountToken.clear();
    throw new Error('Sesión expirada');
  }
  if (!res.ok) throw new Error(parseError(await res.json().catch(() => ({}))));
  return res.json() as Promise<T>;
}

export const accountApi = {
  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const data = await post<AuthResponse>('/account/register', input);
    accountToken.set(data.token);
    return data;
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await post<AuthResponse>('/account/login', { email, password });
    accountToken.set(data.token);
    return data;
  },
  me: () => authed<AccountDTO>('/account/me'),
  updateProfile: (body: { fullName?: string; phone?: string }) =>
    authed<AccountDTO>('/account/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  orders: () => authed<OrderDTO[]>('/account/orders'),
  logout: () => accountToken.clear(),
};
