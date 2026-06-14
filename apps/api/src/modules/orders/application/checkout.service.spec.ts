import { BadRequestException } from '@nestjs/common';
import type { ProductDTO } from '@diligence/contracts';
import { CheckoutService } from './checkout.service';
import type { CatalogService } from '../../catalog/application/catalog.service';
import type { OrderRepository } from '../domain/order.repository';
import type { PaymentProvider } from '../../payments/domain/payment-provider.port';
import type { AppConfigService } from '../../../config/app-config.service';

const product: ProductDTO = {
  id: 'p1',
  slug: 'obsidian-hoodie',
  name: 'Obsidian Hoodie',
  description: '',
  priceInCents: 100000,
  compareAtPriceInCents: null,
  currency: 'COP',
  images: [],
  section: 'hombre',
  category: 'hoodies',
  collection: 'obsidian',
  sizes: ['M'],
  colors: ['Black'],
  stock: 10,
  featured: true,
  isBasic: false,
  isBlank: false,
  onSale: false,
};

describe('CheckoutService', () => {
  let catalog: jest.Mocked<Pick<CatalogService, 'getProductById'>>;
  let orders: jest.Mocked<OrderRepository>;
  let payments: jest.Mocked<PaymentProvider>;
  let config: AppConfigService;
  let service: CheckoutService;

  beforeEach(() => {
    catalog = { getProductById: jest.fn().mockResolvedValue(product) };
    orders = {
      create: jest.fn().mockImplementation((o) =>
        Promise.resolve({ ...o, id: 'order1', status: 'PENDING', wompiTransactionId: null, createdAt: 'now' }),
      ),
      findById: jest.fn(),
      findByReference: jest.fn(),
      updateStatus: jest.fn(),
    };
    payments = {
      createCheckoutSession: jest.fn().mockReturnValue({
        publicKey: 'pub_test',
        reference: 'ref',
        amountInCents: 0,
        currency: 'COP',
        integritySignature: 'sig',
        checkoutUrl: 'https://checkout',
        redirectUrl: 'https://redirect',
      }),
    };
    config = { webUrl: 'http://localhost:3000' } as AppConfigService;

    service = new CheckoutService(
      catalog as unknown as CatalogService,
      orders,
      payments,
      config,
    );
  });

  it('recalcula el monto desde la BD, ignorando precios del cliente', async () => {
    await service.createCheckout({
      items: [{ productId: 'p1', quantity: 3 }],
      customer: { fullName: 'Daniel', email: 'd@test.com', phone: '3001112222' },
    });

    // 3 × 100000 = 300000 (precio de la BD)
    expect(orders.create).toHaveBeenCalledWith(
      expect.objectContaining({ amountInCents: 300000 }),
    );
    expect(payments.createCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({ amountInCents: 300000, currency: 'COP' }),
    );
  });

  it('rechaza el checkout si un producto no existe', async () => {
    catalog.getProductById.mockResolvedValueOnce(null);
    await expect(
      service.createCheckout({
        items: [{ productId: 'missing', quantity: 1 }],
        customer: { fullName: 'Daniel', email: 'd@test.com', phone: '3001112222' },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
