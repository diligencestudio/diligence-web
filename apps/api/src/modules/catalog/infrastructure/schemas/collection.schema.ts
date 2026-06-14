import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema({ collection: 'collections', timestamps: true })
export class Collection {
  @Prop({ required: true, unique: true, index: true })
  slug!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({ type: String, default: null })
  heroImage!: string | null;

  @Prop({ default: 0 })
  order!: number;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
