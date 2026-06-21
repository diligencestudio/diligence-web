import type { Collection } from './collection.entity';

/**
 * Puerto del repositorio de colecciones.
 */
export type CollectionInput = Omit<Collection, 'id'>;

export interface CollectionRepository {
  findAll(): Promise<Collection[]>;
  findBySlug(slug: string): Promise<Collection | null>;
  findById(id: string): Promise<Collection | null>;

  // Escritura (admin)
  create(input: CollectionInput): Promise<Collection>;
  update(id: string, input: Partial<CollectionInput>): Promise<Collection | null>;
  remove(id: string): Promise<boolean>;
}

export const COLLECTION_REPOSITORY = Symbol('COLLECTION_REPOSITORY');
