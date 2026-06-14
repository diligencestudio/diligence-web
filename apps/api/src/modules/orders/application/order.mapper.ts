import type { OrderDTO } from '@diligence/contracts';
import type { Order } from '../domain/order.entity';

export function toOrderDTO(order: Order): OrderDTO {
  return {
    id: order.id,
    reference: order.reference,
    items: order.items,
    amountInCents: order.amountInCents,
    currency: order.currency,
    status: order.status,
    customer: order.customer,
    wompiTransactionId: order.wompiTransactionId,
    createdAt: order.createdAt,
  };
}
