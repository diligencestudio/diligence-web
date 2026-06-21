import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { Collection as CollectionEntity } from '../domain/collection.entity';
import type {
  CollectionInput,
  CollectionRepository,
} from '../domain/collection.repository';
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

  async findById(id: string): Promise<CollectionEntity | null> {
    const doc = await this.model.findById(id).lean().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async create(input: CollectionInput): Promise<CollectionEntity> {
    const created = await this.model.create(input);
    return this.toEntity(
      created.toObject() as unknown as Record<string, unknown> & { _id: unknown },
    );
  }

  async update(
    id: string,
    input: Partial<CollectionInput>,
  ): Promise<CollectionEntity | null> {
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
