import { Module } from '@nestjs/common';
import {
  PAYMENT_EVENT_VERIFIER,
  PAYMENT_PROVIDER,
} from './domain/payment-provider.port';
import { WompiPaymentProvider } from './infrastructure/wompi-payment.provider';
import { WompiEventVerifier } from './infrastructure/wompi-event.verifier';

/**
 * Enlaza los puertos de pago a la implementación concreta de Wompi.
 * Para cambiar de pasarela, solo se sustituyen las clases aquí (OCP).
 */
@Module({
  providers: [
    { provide: PAYMENT_PROVIDER, useClass: WompiPaymentProvider },
    { provide: PAYMENT_EVENT_VERIFIER, useClass: WompiEventVerifier },
  ],
  exports: [PAYMENT_PROVIDER, PAYMENT_EVENT_VERIFIER],
})
export class PaymentsModule {}
