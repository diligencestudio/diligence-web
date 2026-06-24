import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from '../orders/orders.module';
import { CUSTOMER_REPOSITORY } from './domain/customer.repository';
import { MongoCustomerRepository } from './infrastructure/mongo-customer.repository';
import {
  Customer,
  CustomerSchema,
} from './infrastructure/schemas/customer.schema';
import { AccountsService } from './application/accounts.service';
import { AccountsController } from './presentation/accounts.controller';
import { CustomerJwtGuard } from './presentation/customer-jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    OrdersModule,
  ],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    CustomerJwtGuard,
    { provide: CUSTOMER_REPOSITORY, useClass: MongoCustomerRepository },
  ],
})
export class AccountsModule {}
