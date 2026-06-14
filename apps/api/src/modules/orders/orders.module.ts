import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogModule } from '../catalog/catalog.module';
import { PaymentsModule } from '../payments/payments.module';
import { ORDER_REPOSITORY } from './domain/order.repository';
import { MongoOrderRepository } from './infrastructure/mongo-order.repository';
import { Order, OrderSchema } from './infrastructure/schemas/order.schema';
import { CheckoutService } from './application/checkout.service';
import { OrdersService } from './application/orders.service';
import { PaymentWebhookService } from './application/payment-webhook.service';
import { CheckoutController } from './presentation/checkout.controller';
import { OrdersController } from './presentation/orders.controller';
import { WompiWebhookController } from './presentation/wompi-webhook.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CatalogModule,
    PaymentsModule,
  ],
  controllers: [CheckoutController, OrdersController, WompiWebhookController],
  providers: [
    CheckoutService,
    OrdersService,
    PaymentWebhookService,
    { provide: ORDER_REPOSITORY, useClass: MongoOrderRepository },
  ],
})
export class OrdersModule {}
