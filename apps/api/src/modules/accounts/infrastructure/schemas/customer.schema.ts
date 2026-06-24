import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ collection: 'customers', timestamps: true })
export class Customer {
  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  fullName!: string;

  @Prop({ default: '' })
  phone!: string;

  @Prop({ required: true })
  passwordHash!: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
