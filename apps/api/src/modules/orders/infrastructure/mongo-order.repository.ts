import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { OrderStatus } from '@diligence/contracts';
import type { NewOrder, Order as OrderEntity } from '../domain/order.entity';
import type { OrderRepository } from '../domain/order.repository';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class MongoOrderRepository implements OrderRepository {
  constructor(
    @InjectModel(Order.name) private readonly model: Model<OrderDocument>,
  ) {}

  async create(order: NewOrder): Promise<OrderEntity> {
    const created = await this.model.create({ ...order, status: 'PENDING' });
    return this.toEntity(
      created.toObject() as unknown as Record<string, unknown> & { _id: unknown },
    );
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const doc = await this.model.findById(id).lean().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByReference(reference: string): Promise<OrderEntity | null> {
    const doc = await this.model.findOne({ reference }).lean().exec();
    return doc ? this.toEntity(doc) : null;
  }

  async updateStatus(
    reference: string,
    status: OrderStatus,
    wompiTransactionId: string | null,
  ): Promise<void> {
    await this.model
      .updateOne({ reference }, { $set: { status, wompiTransactionId } })
      .exec();
  }

  private toEntity(doc: Record<string, unknown> & { _id: unknown }): OrderEntity {
    const customer = (doc.customer ?? {}) as Record<string, string>;
    return {
      id: String(doc._id),
      reference: doc.reference as string,
      items: ((doc.items as unknown[]) ?? []).map((i) => {
        const item = i as Record<string, unknown>;
        return {
          productId: item.productId as string,
          slug: item.slug as string,
          name: item.name as string,
          quantity: item.quantity as number,
          priceInCents: item.priceInCents as number,
          size: item.size as string | undefined,
          color: item.color as string | undefined,
        };
      }),
      amountInCents: doc.amountInCents as number,
      currency: 'COP',
      status: doc.status as OrderStatus,
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
      wompiTransactionId: (doc.wompiTransactionId as string | null) ?? null,
      createdAt:
        doc.createdAt instanceof Date
          ? doc.createdAt.toISOString()
          : new Date().toISOString(),
    };
  }
}
