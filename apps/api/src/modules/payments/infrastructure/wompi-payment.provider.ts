import { createHash } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../../config/app-config.service';
import type {
  CheckoutParams,
  CheckoutSession,
  PaymentProvider,
} from '../domain/payment-provider.port';

/**
 * Adaptador de Wompi para crear sesiones de Web Checkout.
 * Genera la firma de integridad: SHA256(reference + amountInCents + currency + secret).
 */
@Injectable()
export class WompiPaymentProvider implements PaymentProvider {
  constructor(private readonly config: AppConfigService) {}

  createCheckoutSession(params: CheckoutParams): CheckoutSession {
    const { publicKey, integritySecret, checkoutUrl } = this.config.wompi;
    const { reference, amountInCents, currency, redirectUrl } = params;

    const integritySignature = createHash('sha256')
      .update(`${reference}${amountInCents}${currency}${integritySecret}`)
      .digest('hex');

    // Web Checkout de Wompi (redirect GET). Se arma manualmente para preservar
    // la clave "signature:integrity" sin codificar los dos puntos.
    const query = [
      `public-key=${encodeURIComponent(publicKey)}`,
      `currency=${currency}`,
      `amount-in-cents=${amountInCents}`,
      `reference=${encodeURIComponent(reference)}`,
      `signature:integrity=${integritySignature}`,
      `redirect-url=${encodeURIComponent(redirectUrl)}`,
    ].join('&');

    return {
      publicKey,
      reference,
      amountInCents,
      currency,
      integritySignature,
      checkoutUrl: `${checkoutUrl}?${query}`,
      redirectUrl,
    };
  }
}
