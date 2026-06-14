import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CollectionDTO, ProductDTO } from '@diligence/contracts';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../domain/product.repository';
import {
  COLLECTION_REPOSITORY,
  type CollectionRepository,
} from '../domain/collection.repository';
import { ProductQueryDto } from './dto/product-query.dto';
import { toCollectionDTO, toProductDTO } from './catalog.mapper';

/**
 * Casos de uso del catálogo. Depende solo de los PUERTOS (interfaces de
 * repositorio), nunca de Mongoose. Aquí vive la lógica de negocio de lectura.
 */
@Injectable()
export class CatalogService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
    @Inject(COLLECTION_REPOSITORY)
    private readonly collections: CollectionRepository,
  ) {}

  async listProducts(query: ProductQueryDto): Promise<{
    items: ProductDTO[];
    total: number;
  }> {
    const [items, total] = await Promise.all([
      this.products.findMany(query),
      this.products.count(query),
    ]);
    return { items: items.map(toProductDTO), total };
  }

  async getProductBySlug(slug: string): Promise<ProductDTO> {
    const product = await this.products.findBySlug(slug);
    if (!product) {
      throw new NotFoundException(`Producto "${slug}" no encontrado`);
    }
    return toProductDTO(product);
  }

  /** Devuelve el producto por id, o null (usado al recalcular el checkout). */
  async getProductById(id: string): Promise<ProductDTO | null> {
    const product = await this.products.findById(id);
    return product ? toProductDTO(product) : null;
  }

  async listCollections(): Promise<CollectionDTO[]> {
    const collections = await this.collections.findAll();
    return collections.map(toCollectionDTO);
  }

  async getCollectionBySlug(slug: string): Promise<CollectionDTO> {
    const collection = await this.collections.findBySlug(slug);
    if (!collection) {
      throw new NotFoundException(`Colección "${slug}" no encontrada`);
    }
    return toCollectionDTO(collection);
  }
}
