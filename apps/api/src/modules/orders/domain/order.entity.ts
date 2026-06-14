import type { OrderStatus } from '@diligence/contracts';

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  priceInCents: number;
  size?: string;
  color?: string;
}

export interface Customer {
  fullName: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  reference: string;
  items: OrderItem[];
  amountInCents: number;
  currency: 'COP';
  status: OrderStatus;
  customer: Customer;
  wompiTransactionId: string | null;
  createdAt: string;
}

export interface NewOrder {
  reference: string;
  items: OrderItem[];
  amountInCents: number;
  currency: 'COP';
  customer: Customer;
}
