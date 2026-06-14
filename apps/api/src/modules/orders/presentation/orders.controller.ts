import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from '../application/orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get('by-reference')
  @ApiOkResponse({ description: 'Orden por referencia (?ref=DLG-...)' })
  getByReference(@Query('ref') ref: string) {
    return this.orders.getByReference(ref);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Orden por id' })
  getById(@Param('id') id: string) {
    return this.orders.getById(id);
  }
}
