/**
 * Tokens de marca DILIGENCE — fuente de verdad de la colorimetría entregada.
 * Replicados en theme.css como variables de Tailwind v4.
 */
export const brandColors = {
  obsidian: '#050505',
  graphite: '#111111',
  gunmetal: '#2B2B2B',
  titanium: '#7E7E7E',
  chrome: '#C9C9C9',
  white: '#FFFFFF',
} as const;

export type BrandColor = keyof typeof brandColors;

export const brand = {
  name: 'DILIGENCE',
  monogram: 'D⁄G',
  tagline: 'Lujo oscuro. Precisión absoluta.',
} as const;
