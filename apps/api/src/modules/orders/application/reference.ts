import { randomBytes } from 'node:crypto';

/**
 * Referencia única de orden, p.ej. "DLG-LXR8K2-9F3A".
 * Wompi exige una referencia única por transacción.
 */
export function generateReference(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = randomBytes(2).toString('hex').toUpperCase();
  return `DLG-${time}-${rand}`;
}
