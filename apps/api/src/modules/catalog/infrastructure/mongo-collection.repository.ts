import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { Collection as CollectionEntity } from '../domain/collection.entity';
import type { CollectionRepository } from '../domain/collection.repository';
import { Collection, CollectionDocument } from './schemas/collection.schema';

@Injectable()
export class MongoCollectionRepository implements CollectionRepository {
  constructor(
    @InjectModel(Collection.name)
    private readonly model: Model<CollectionDocument>,
  ) {}

  async findAll(): Promise<CollectionEntity[]> {
    const docs = await this.model.find().sort({ order: 1 }).lean().exec();
    return docs.map((d) => this.toEntity(d));
  }

  async findBySlug(slug: string): Promise<CollectionEntity | null> {
    const doc = await this.model.findOne({ slug }).lean().exec();
    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: Record<string, unknown> & { _id: unknown }): CollectionEntity {
    return {
      id: String(doc._id),
      slug: doc.slug as string,
      title: doc.title as string,
      description: doc.description as string,
      heroImage: (doc.heroImage as string | null) ?? null,
      order: (doc.order as number) ?? 0,
    };
  }
}
