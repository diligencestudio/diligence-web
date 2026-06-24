import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type {
  Customer as CustomerEntity,
  NewCustomer,
} from '../domain/customer.entity';
import type { CustomerRepository } from '../domain/customer.repository';
import { Customer, CustomerDocument } from './schemas/customer.schema';

@Injectable()
export class MongoCustomerRepository implements CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private readonly model: Model<CustomerDocument>,
  ) {}

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    const doc = await this.model
      .findOne({ email: email.trim().toLowerCase() })
      .lean()
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    const doc = await this.model.findById(id).lean().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async create(input: NewCustomer): Promise<CustomerEntity> {
    const created = await this.model.create({
      ...input,
      email: input.email.trim().toLowerCase(),
    });
    return this.toEntity(
      created.toObject() as unknown as Record<string, unknown> & { _id: unknown },
    );
  }

  async updateProfile(
    id: string,
    data: { fullName?: string; phone?: string },
  ): Promise<CustomerEntity | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .lean()
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: Record<string, unknown> & { _id: unknown }): CustomerEntity {
    return {
      id: String(doc._id),
      email: doc.email as string,
      fullName: doc.fullName as string,
      phone: (doc.phone as string) ?? '',
      passwordHash: doc.passwordHash as string,
      createdAt:
        doc.createdAt instanceof Date
          ? doc.createdAt.toISOString()
          : new Date().toISOString(),
    };
  }
}
