import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { OrderDTO } from '@diligence/contracts';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../domain/order.repository';
import { toOrderDTO } from './order.mapper';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  async getById(id: string): Promise<OrderDTO> {
    const order = await this.orders.findById(id);
    if (!order) throw new NotFoundException(`Orden ${id} no encontrada`);
    return toOrderDTO(order);
  }

  async getByReference(reference: string): Promise<OrderDTO> {
    const order = await this.orders.findByReference(reference);
    if (!order) throw new NotFoundException(`Orden ${reference} no encontrada`);
    return toOrderDTO(order);
  }
}
