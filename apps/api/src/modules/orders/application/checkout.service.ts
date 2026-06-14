import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { CheckoutSessionDTO } from '@diligence/contracts';
import { CatalogService } from '../../catalog/application/catalog.service';
import {
  PAYMENT_PROVIDER,
  type PaymentProvider,
} from '../../payments/domain/payment-provider.port';
import { AppConfigService } from '../../../config/app-config.service';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../domain/order.repository';
import type { OrderItem } from '../domain/order.entity';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { generateReference } from './reference';

/**
 * Caso de uso: crear una sesión de checkout.
 * Regla de negocio clave: los precios SIEMPRE se recalculan desde la BD,
 * nunca se confía en lo que envía el cliente.
 */
@Injectable()
export class CheckoutService {
  constructor(
    private readonly catalog: CatalogService,
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
    @Inject(PAYMENT_PROVIDER) private readonly payments: PaymentProvider,
    private readonly config: AppConfigService,
  ) {}

  async createCheckout(dto: CreateCheckoutDto): Promise<CheckoutSessionDTO> {
    const items: OrderItem[] = [];

    for (const line of dto.items) {
      const product = await this.catalog.getProductById(line.productId);
      if (!product) {
        throw new BadRequestException(
          `Producto ${line.productId} no existe o no está disponible`,
        );
      }
      items.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        quantity: line.quantity,
        priceInCents: product.priceInCents, // precio de la BD
        size: line.size,
        color: line.color,
      });
    }

    const amountInCents = items.reduce(
      (sum, i) => sum + i.priceInCents * i.quantity,
      0,
    );

    const reference = generateReference();
    const order = await this.orders.create({
      reference,
      items,
      amountInCents,
      currency: 'COP',
      customer: dto.customer,
    });

    const redirectUrl = `${this.config.webUrl}/checkout/resultado?ref=${reference}`;
    const session = this.payments.createCheckoutSession({
      reference,
      amountInCents,
      currency: 'COP',
      redirectUrl,
    });

    return {
      orderId: order.id,
      reference,
      amountInCents,
      currency: 'COP',
      publicKey: session.publicKey,
      integritySignature: session.integritySignature,
      checkoutUrl: session.checkoutUrl,
      redirectUrl,
    };
  }
}
