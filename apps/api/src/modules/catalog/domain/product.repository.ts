import type { Product } from './product.entity';

export interface ProductQuery {
  section?: string;
  collection?: string;
  category?: string;
  featured?: boolean;
  basic?: boolean;
  blank?: boolean;
  sale?: boolean;
  search?: string;
  limit?: number;
  skip?: number;
}

/**
 * Puerto (interfaz) del repositorio de productos. La capa de aplicación depende
 * de ESTO, no de Mongoose (DIP). El token permite inyectar la implementación
 * concreta vía DI.
 */
export type ProductInput = Omit<Product, 'id'>;

export interface ProductRepository {
  findMany(query: ProductQuery): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  count(query: ProductQuery): Promise<number>;

  // Escritura (admin)
  findAllForAdmin(): Promise<Product[]>;
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: Partial<ProductInput>): Promise<Product | null>;
  remove(id: string): Promise<boolean>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
