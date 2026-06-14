import { createHash } from 'node:crypto';
import { OrderStatus } from '@diligence/contracts';
import { WompiEventVerifier } from './wompi-event.verifier';
import type { AppConfigService } from '../../../config/app-config.service';

const EVENTS_SECRET = 'events_secret';

function makeConfig(): AppConfigService {
  return {
    wompi: { eventsSecret: EVENTS_SECRET },
  } as unknown as AppConfigService;
}

function buildEvent(overrides: { checksum?: string } = {}) {
  const txid = 'tx_1';
  const status = 'APPROVED';
  const amount = 50000;
  const timestamp = 1718000000;
  const properties = [
    'transaction.id',
    'transaction.status',
    'transaction.amount_in_cents',
  ];
  const checksum =
    overrides.checksum ??
    createHash('sha256')
      .update(`${txid}${status}${amount}${timestamp}${EVENTS_SECRET}`)
      .digest('hex');

  return {
    event: 'transaction.updated',
    data: {
      transaction: {
        id: txid,
        status,
        reference: 'DLG-123',
        amount_in_cents: amount,
      },
    },
    signature: { properties, checksum },
    timestamp,
  };
}

describe('WompiEventVerifier', () => {
  const verifier = new WompiEventVerifier(makeConfig());

  it('acepta un evento con checksum válido y lo normaliza', () => {
    const result = verifier.verify(buildEvent());
    expect(result).toEqual({
      reference: 'DLG-123',
      transactionId: 'tx_1',
      status: OrderStatus.APPROVED,
    });
  });

  it('rechaza un evento con checksum inválido', () => {
    expect(verifier.verify(buildEvent({ checksum: 'deadbeef' }))).toBeNull();
  });

  it('rechaza un evento con estructura incompleta', () => {
    expect(verifier.verify({ foo: 'bar' })).toBeNull();
  });
});
