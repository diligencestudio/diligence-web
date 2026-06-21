import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CollectionDTO, ProductDTO } from '@diligence/contracts';
import {
  PRODUCT_REPOSITORY,
  type ProductInput,
  type ProductRepository,
} from '../domain/product.repository';
import {
  COLLECTION_REPOSITORY,
  type CollectionInput,
  type CollectionRepository,
} from '../domain/collection.repository';
import { ProductQueryDto } from './dto/product-query.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product-write.dto';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
} from './dto/collection-write.dto';
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

  // ── Admin: productos ────────────────────────────────────────────────────────

  async listAllProducts(): Promise<ProductDTO[]> {
    const items = await this.products.findAllForAdmin();
    return items.map(toProductDTO);
  }

  async createProduct(dto: CreateProductDto): Promise<ProductDTO> {
    const created = await this.products.create(this.toProductInput(dto));
    return toProductDTO(created);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductDTO> {
    const updated = await this.products.update(id, dto as Partial<ProductInput>);
    if (!updated) throw new NotFoundException(`Producto ${id} no encontrado`);
    return toProductDTO(updated);
  }

  async deleteProduct(id: string): Promise<{ deleted: boolean }> {
    const ok = await this.products.remove(id);
    if (!ok) throw new NotFoundException(`Producto ${id} no encontrado`);
    return { deleted: true };
  }

  // ── Admin: colecciones ───────────────────────────────────────────────────────

  async createCollection(dto: CreateCollectionDto): Promise<CollectionDTO> {
    const created = await this.collections.create(this.toCollectionInput(dto));
    return toCollectionDTO(created);
  }

  async updateCollection(
    id: string,
    dto: UpdateCollectionDto,
  ): Promise<CollectionDTO> {
    const updated = await this.collections.update(
      id,
      dto as Partial<CollectionInput>,
    );
    if (!updated) throw new NotFoundException(`Colección ${id} no encontrada`);
    return toCollectionDTO(updated);
  }

  async deleteCollection(id: string): Promise<{ deleted: boolean }> {
    const ok = await this.collections.remove(id);
    if (!ok) throw new NotFoundException(`Colección ${id} no encontrada`);
    return { deleted: true };
  }

  // Aplica los valores por defecto del dominio a la entrada del admin.
  private toProductInput(dto: CreateProductDto): ProductInput {
    return {
      slug: dto.slug,
      name: dto.name,
      description: dto.description ?? '',
      priceInCents: dto.priceInCents,
      compareAtPriceInCents: dto.compareAtPriceInCents ?? null,
      currency: 'COP',
      images: dto.images ?? [],
      section: dto.section,
      category: dto.category,
      collection: dto.collection ?? null,
      sizes: dto.sizes ?? [],
      colors: dto.colors ?? [],
      stock: dto.stock ?? 0,
      featured: dto.featured ?? false,
      isBasic: dto.isBasic ?? false,
      isBlank: dto.isBlank ?? false,
      onSale: dto.onSale ?? false,
      active: dto.active ?? true,
    };
  }

  private toCollectionInput(dto: CreateCollectionDto): CollectionInput {
    return {
      slug: dto.slug,
      title: dto.title,
      description: dto.description ?? '',
      heroImage: dto.heroImage ?? null,
      order: dto.order ?? 0,
    };
  }
}
