import { createHash } from 'node:crypto';
import { WompiPaymentProvider } from './wompi-payment.provider';
import type { AppConfigService } from '../../../config/app-config.service';

function makeConfig(): AppConfigService {
  return {
    wompi: {
      publicKey: 'pub_test_abc',
      privateKey: 'prv_test_abc',
      integritySecret: 'integrity_secret',
      eventsSecret: 'events_secret',
      checkoutUrl: 'https://checkout.wompi.co/p/',
      baseUrl: 'https://sandbox.wompi.co/v1',
    },
  } as unknown as AppConfigService;
}

describe('WompiPaymentProvider', () => {
  const provider = new WompiPaymentProvider(makeConfig());

  it('genera la firma de integridad SHA256(reference+amount+currency+secret)', () => {
    const session = provider.createCheckoutSession({
      reference: 'DLG-123',
      amountInCents: 50000,
      currency: 'COP',
      redirectUrl: 'http://localhost:3000/checkout/resultado?ref=DLG-123',
    });

    const expected = createHash('sha256')
      .update('DLG-12350000COPintegrity_secret')
      .digest('hex');

    expect(session.integritySignature).toBe(expected);
  });

  it('arma la URL de Web Checkout con la clave signature:integrity sin codificar', () => {
    const session = provider.createCheckoutSession({
      reference: 'DLG-123',
      amountInCents: 50000,
      currency: 'COP',
      redirectUrl: 'http://localhost:3000/r',
    });

    expect(session.checkoutUrl).toContain('signature:integrity=');
    expect(session.checkoutUrl).toContain('public-key=pub_test_abc');
    expect(session.checkoutUrl).toContain('amount-in-cents=50000');
  });
});
