import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: 'products', timestamps: true, suppressReservedKeysWarning: true })
export class Product {
  @Prop({ required: true, unique: true, index: true })
  slug!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({ required: true, min: 0 })
  priceInCents!: number;

  @Prop({ type: Number, default: null })
  compareAtPriceInCents!: number | null;

  @Prop({ default: 'COP' })
  currency!: string;

  @Prop({ default: 'unisex', index: true })
  section!: string;

  @Prop({
    type: [{ url: String, alt: String }],
    default: [],
  })
  images!: { url: string; alt: string }[];

  @Prop({ required: true, index: true })
  category!: string;

  @Prop({ type: String, default: null, index: true })
  collection!: string | null;

  @Prop({ type: [String], default: [] })
  sizes!: string[];

  @Prop({ type: [String], default: [] })
  colors!: string[];

  @Prop({ default: 0, min: 0 })
  stock!: number;

  @Prop({ default: false, index: true })
  featured!: boolean;

  @Prop({ default: false, index: true })
  isBasic!: boolean;

  @Prop({ default: false, index: true })
  isBlank!: boolean;

  @Prop({ default: false, index: true })
  onSale!: boolean;

  @Prop({ default: true, index: true })
  active!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
