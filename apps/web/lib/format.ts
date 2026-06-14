/**
 * Formatea centavos COP a string de moneda colombiana.
 * 32900000 -> "$ 329.000"
 */
export function formatCOP(amountInCents: number): string {
  const pesos = Math.round(amountInCents / 100);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(pesos);
}
