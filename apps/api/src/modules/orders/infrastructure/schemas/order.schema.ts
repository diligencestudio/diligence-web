import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderStatus } from '@diligence/contracts';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
class OrderItem {
  @Prop({ required: true }) productId!: string;
  @Prop({ required: true }) slug!: string;
  @Prop({ required: true }) name!: string;
  @Prop({ required: true, min: 1 }) quantity!: number;
  @Prop({ required: true, min: 0 }) priceInCents!: number;
  @Prop() size?: string;
  @Prop() color?: string;
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
class Customer {
  @Prop({ required: true }) fullName!: string;
  @Prop({ required: true }) email!: string;
  @Prop({ required: true }) phone!: string;
}
const CustomerSchema = SchemaFactory.createForClass(Customer);

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  @Prop({ required: true, unique: true, index: true })
  reference!: string;

  @Prop({ type: [OrderItemSchema], default: [] })
  items!: OrderItem[];

  @Prop({ required: true, min: 0 })
  amountInCents!: number;

  @Prop({ default: 'COP' })
  currency!: string;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
    index: true,
  })
  status!: OrderStatus;

  @Prop({ type: CustomerSchema, required: true })
  customer!: Customer;

  @Prop({ type: String, default: null })
  wompiTransactionId!: string | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
