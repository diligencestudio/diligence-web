import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Product } from '../modules/catalog/infrastructure/schemas/product.schema';
import { Collection } from '../modules/catalog/infrastructure/schemas/collection.schema';
import { collectionsSeed, productsSeed } from './seed.data';

/**
 * Carga datos demo de DILIGENCE en MongoDB. Idempotente: limpia y reinserta.
 *   npm run seed -w @diligence/api
 */
async function run() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const productModel = app.get<Model<Product>>(getModelToken(Product.name));
  const collectionModel = app.get<Model<Collection>>(
    getModelToken(Collection.name),
  );

  await Promise.all([productModel.deleteMany({}), collectionModel.deleteMany({})]);
  await collectionModel.insertMany(collectionsSeed);
  await productModel.insertMany(productsSeed);

  logger.log(
    `Seed completado: ${collectionsSeed.length} colecciones, ${productsSeed.length} productos.`,
  );
  await app.close();
  process.exit(0);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Error en el seed:', err);
  process.exit(1);
});
