import type { Collection } from './collection.entity';

/**
 * Puerto del repositorio de colecciones.
 */
export interface CollectionRepository {
  findAll(): Promise<Collection[]>;
  findBySlug(slug: string): Promise<Collection | null>;
}

export const COLLECTION_REPOSITORY = Symbol('COLLECTION_REPOSITORY');
