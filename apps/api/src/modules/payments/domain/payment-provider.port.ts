import type { OrderStatus } from '@diligence/contracts';

export interface CheckoutParams {
  reference: string;
  amountInCents: number;
  currency: 'COP';
  redirectUrl: string;
}

export interface CheckoutSession {
  publicKey: string;
  reference: string;
  amountInCents: number;
  currency: 'COP';
  integritySignature: string;
  checkoutUrl: string;
  redirectUrl: string;
}

/**
 * Puerto de la pasarela de pago. El caso de uso de checkout depende de ESTO.
 * Cambiar Wompi por otro proveedor = nueva implementación, sin tocar la app (OCP/LSP).
 */
export interface PaymentProvider {
  createCheckoutSession(params: CheckoutParams): CheckoutSession;
}

export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');

// ─── Verificación de eventos (ISP: interfaz separada del checkout) ────────────

export interface VerifiedPaymentEvent {
  reference: string;
  transactionId: string;
  status: OrderStatus;
}

export interface PaymentEventVerifier {
  /** Valida la firma del webhook y devuelve el evento normalizado, o null si es inválido. */
  verify(rawBody: unknown): VerifiedPaymentEvent | null;
}

export const PAYMENT_EVENT_VERIFIER = Symbol('PAYMENT_EVENT_VERIFIER');
