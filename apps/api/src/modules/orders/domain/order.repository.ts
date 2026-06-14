import type { OrderStatus } from '@diligence/contracts';
import type { NewOrder, Order } from './order.entity';

/**
 * Puerto del repositorio de órdenes. La capa de aplicación depende de esta
 * interfaz, no de Mongoose.
 */
export interface OrderRepository {
  create(order: NewOrder): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByReference(reference: string): Promise<Order | null>;
  updateStatus(
    reference: string,
    status: OrderStatus,
    wompiTransactionId: string | null,
  ): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
