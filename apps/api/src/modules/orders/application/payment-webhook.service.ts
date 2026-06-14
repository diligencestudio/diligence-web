import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  PAYMENT_EVENT_VERIFIER,
  type PaymentEventVerifier,
} from '../../payments/domain/payment-provider.port';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../domain/order.repository';

/**
 * Caso de uso: procesar un webhook de la pasarela.
 * Verifica la firma del evento (vía el puerto) y actualiza el estado de la orden.
 * Devuelve siempre de forma idempotente; nunca confía en el body sin verificar.
 */
@Injectable()
export class PaymentWebhookService {
  private readonly logger = new Logger(PaymentWebhookService.name);

  constructor(
    @Inject(PAYMENT_EVENT_VERIFIER)
    private readonly verifier: PaymentEventVerifier,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async handle(rawBody: unknown): Promise<{ received: boolean }> {
    const event = this.verifier.verify(rawBody);
    if (!event) {
      // Firma inválida: ignoramos pero respondemos 200 para no reintentos infinitos.
      this.logger.warn('Webhook descartado: firma inválida');
      return { received: false };
    }

    const order = await this.orders.findByReference(event.reference);
    if (!order) {
      this.logger.warn(`Webhook para orden inexistente: ${event.reference}`);
      return { received: false };
    }

    await this.orders.updateStatus(
      event.reference,
      event.status,
      event.transactionId,
    );
    this.logger.log(
      `Orden ${event.reference} actualizada a ${event.status} (tx ${event.transactionId})`,
    );
    return { received: true };
  }
}
