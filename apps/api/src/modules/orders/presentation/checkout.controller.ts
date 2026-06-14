import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CheckoutService } from '../application/checkout.service';
import { CreateCheckoutDto } from '../application/dto/create-checkout.dto';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Sesión de checkout de Wompi creada' })
  create(@Body() dto: CreateCheckoutDto) {
    return this.checkout.createCheckout(dto);
  }
}
