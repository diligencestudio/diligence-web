/**
 * Entidad de dominio para una colección (agrupación editorial de productos).
 */
export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string | null;
  order: number;
}
