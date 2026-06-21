import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import type { Product as ProductEntity } from '../domain/product.entity';
import type {
  ProductInput,
  ProductQuery,
  ProductRepository,
} from '../domain/product.repository';
import { Product, ProductDocument } from './schemas/product.schema';

/**
 * Implementación concreta del puerto ProductRepository sobre MongoDB/Mongoose.
 * Es la ÚNICA capa que conoce Mongoose. Mapea el documento al modelo de dominio.
 */
@Injectable()
export class MongoProductRepository implements ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly model: Model<ProductDocument>,
  ) {}

  private toFilter(query: ProductQuery): FilterQuery<ProductDocument> {
    const filter: FilterQuery<ProductDocument> = { active: true };
    if (query.section) filter.section = query.section;
    if (query.collection) filter.collection = query.collection;
    if (query.category) filter.category = query.category;
    if (query.featured !== undefined) filter.featured = query.featured;
    if (query.basic !== undefined) filter.isBasic = query.basic;
    if (query.blank !== undefined) filter.isBlank = query.blank;
    if (query.sale !== undefined) filter.onSale = query.sale;
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    return filter;
  }

  async findMany(query: ProductQuery): Promise<ProductEntity[]> {
    const docs = await this.model
      .find(this.toFilter(query))
      .sort({ createdAt: -1 })
      .skip(query.skip ?? 0)
      .limit(query.limit ?? 50)
      .lean()
      .exec();
    return docs.map((d) => this.toEntity(d));
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const doc = await this.model.findOne({ slug, active: true }).lean().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const doc = await this.model.findById(id).lean().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async count(query: ProductQuery): Promise<number> {
    return this.model.countDocuments(this.toFilter(query)).exec();
  }

  async findAllForAdmin(): Promise<ProductEntity[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).lean().exec();
    return docs.map((d) => this.toEntity(d));
  }

  async create(input: ProductInput): Promise<ProductEntity> {
    const created = await this.model.create(input);
    return this.toEntity(
      created.toObject() as unknown as Record<string, unknown> & { _id: unknown },
    );
  }

  async update(
    id: string,
    input: Partial<ProductInput>,
  ): Promise<ProductEntity | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: input }, { new: true })
      .lean()
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async remove(id: string): Promise<boolean> {
    const res = await this.model.deleteOne({ _id: id }).exec();
    return res.deletedCount > 0;
  }

  private toEntity(doc: Record<string, unknown> & { _id: unknown }): ProductEntity {
    return {
      id: String(doc._id),
      slug: doc.slug as string,
      name: doc.name as string,
      description: doc.description as string,
      priceInCents: doc.priceInCents as number,
      compareAtPriceInCents: (doc.compareAtPriceInCents as number | null) ?? null,
      currency: 'COP',
      images: (doc.images as { url: string; alt: string }[]) ?? [],
      section: ((doc.section as string) ?? 'unisex') as ProductEntity['section'],
      category: doc.category as string,
      collection: (doc.collection as string | null) ?? null,
      sizes: (doc.sizes as string[]) ?? [],
      colors: (doc.colors as string[]) ?? [],
      stock: (doc.stock as number) ?? 0,
      featured: Boolean(doc.featured),
      isBasic: Boolean(doc.isBasic),
      isBlank: Boolean(doc.isBlank),
      onSale: Boolean(doc.onSale),
      active: Boolean(doc.active),
    };
  }
}
