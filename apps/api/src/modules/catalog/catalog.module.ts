import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogService } from './application/catalog.service';
import { PRODUCT_REPOSITORY } from './domain/product.repository';
import { COLLECTION_REPOSITORY } from './domain/collection.repository';
import { MongoProductRepository } from './infrastructure/mongo-product.repository';
import { MongoCollectionRepository } from './infrastructure/mongo-collection.repository';
import { Product, ProductSchema } from './infrastructure/schemas/product.schema';
import {
  Collection,
  CollectionSchema,
} from './infrastructure/schemas/collection.schema';
import { ProductsController } from './presentation/products.controller';
import { CollectionsController } from './presentation/collections.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Collection.name, schema: CollectionSchema },
    ]),
  ],
  controllers: [ProductsController, CollectionsController],
  providers: [
    CatalogService,
    // DIP: el puerto (token) se enlaza a la implementación concreta de Mongo.
    { provide: PRODUCT_REPOSITORY, useClass: MongoProductRepository },
    { provide: COLLECTION_REPOSITORY, useClass: MongoCollectionRepository },
  ],
  exports: [CatalogService],
})
export class CatalogModule {}
