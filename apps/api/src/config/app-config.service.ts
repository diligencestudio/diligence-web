import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from './env.validation';

/**
 * Acceso tipado a la configuración. Evita leer process.env disperso por el código
 * y centraliza la fuente de verdad (DIP: el resto del código depende de esta
 * abstracción, no de variables globales).
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  get nodeEnv(): Env['NODE_ENV'] {
    return this.config.get('NODE_ENV', { infer: true });
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get port(): number {
    return this.config.get('API_PORT', { infer: true });
  }

  get mongoUri(): string {
    return this.config.get('MONGODB_URI', { infer: true });
  }

  get webUrl(): string {
    return this.config.get('WEB_URL', { infer: true });
  }

  get corsOrigins(): string[] {
    return this.config.get('CORS_ORIGINS', { infer: true }) as unknown as string[];
  }

  get wompi() {
    return {
      baseUrl: this.config.get('WOMPI_BASE_URL', { infer: true }),
      publicKey: this.config.get('WOMPI_PUBLIC_KEY', { infer: true }),
      privateKey: this.config.get('WOMPI_PRIVATE_KEY', { infer: true }),
      integritySecret: this.config.get('WOMPI_INTEGRITY_SECRET', { infer: true }),
      eventsSecret: this.config.get('WOMPI_EVENTS_SECRET', { infer: true }),
      checkoutUrl: this.config.get('WOMPI_CHECKOUT_URL', { infer: true }),
    };
  }
}
