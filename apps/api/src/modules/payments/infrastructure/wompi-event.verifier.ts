import { createHash } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { OrderStatus } from '@diligence/contracts';
import { AppConfigService } from '../../../config/app-config.service';
import type {
  PaymentEventVerifier,
  VerifiedPaymentEvent,
} from '../domain/payment-provider.port';

interface WompiEvent {
  event?: string;
  data?: { transaction?: Record<string, unknown> };
  signature?: { properties?: string[]; checksum?: string };
  timestamp?: number;
}

const STATUS_MAP: Record<string, OrderStatus> = {
  APPROVED: OrderStatus.APPROVED,
  DECLINED: OrderStatus.DECLINED,
  VOIDED: OrderStatus.VOIDED,
  ERROR: OrderStatus.ERROR,
  PENDING: OrderStatus.PENDING,
};

/**
 * Verifica el checksum de los eventos (webhooks) de Wompi.
 * checksum = SHA256( concat(valores de signature.properties) + timestamp + eventsSecret )
 */
@Injectable()
export class WompiEventVerifier implements PaymentEventVerifier {
  private readonly logger = new Logger(WompiEventVerifier.name);

  constructor(private readonly config: AppConfigService) {}

  verify(rawBody: unknown): VerifiedPaymentEvent | null {
    const body = rawBody as WompiEvent;
    const properties = body?.signature?.properties;
    const checksum = body?.signature?.checksum;
    const timestamp = body?.timestamp;
    const transaction = body?.data?.transaction;

    if (!properties || !checksum || timestamp === undefined || !transaction) {
      this.logger.warn('Evento Wompi con estructura inválida');
      return null;
    }

    const concatenated =
      properties.map((path) => String(this.resolve(body.data, path))).join('') +
      String(timestamp) +
      this.config.wompi.eventsSecret;

    const computed = createHash('sha256').update(concatenated).digest('hex');
    if (computed.toLowerCase() !== checksum.toLowerCase()) {
      this.logger.warn('Checksum de evento Wompi no coincide');
      return null;
    }

    const status = STATUS_MAP[String(transaction.status)] ?? OrderStatus.ERROR;
    return {
      reference: String(transaction.reference),
      transactionId: String(transaction.id),
      status,
    };
  }

  /** Resuelve rutas tipo "transaction.id" relativas a `data` del evento. */
  private resolve(data: unknown, path: string): unknown {
    return path
      .split('.')
      .reduce<unknown>(
        (acc, key) =>
          acc && typeof acc === 'object'
            ? (acc as Record<string, unknown>)[key]
            : undefined,
        data,
      );
  }
}
