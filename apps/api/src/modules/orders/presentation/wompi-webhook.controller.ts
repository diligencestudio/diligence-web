import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { PaymentWebhookService } from '../application/payment-webhook.service';

@Controller('payments/wompi')
export class WompiWebhookController {
  constructor(private readonly webhook: PaymentWebhookService) {}

  @Post('webhook')
  @HttpCode(200)
  @ApiExcludeEndpoint()
  handle(@Body() body: unknown) {
    return this.webhook.handle(body);
  }
}
