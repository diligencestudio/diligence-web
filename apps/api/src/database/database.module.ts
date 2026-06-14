import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/app-config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        uri: config.mongoUri,
      }),
    }),
  ],
})
export class DatabaseModule {}
