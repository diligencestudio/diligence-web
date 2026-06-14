import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  check() {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return {
      status: 'ok',
      service: 'diligence-api',
      db: states[this.connection.readyState] ?? 'unknown',
      timestamp: new Date().toISOString(),
    };
  }
}
