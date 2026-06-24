import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    AppConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : { target: 'pino-pretty', options: { singleLine: true } },
        autoLogging: true,
      },
    }),
    DatabaseModule,
    AuthModule,
    CatalogModule,
    OrdersModule,
    AccountsModule,
    UploadsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
