import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountsService } from '../application/accounts.service';
import { RegisterDto } from '../application/dto/register.dto';
import { AccountLoginDto } from '../application/dto/account-login.dto';
import { UpdateProfileDto } from '../application/dto/update-profile.dto';
import { CustomerJwtGuard, type CustomerRequest } from './customer-jwt.guard';

@ApiTags('account')
@Controller('account')
export class AccountsController {
  constructor(private readonly accounts: AccountsService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.accounts.register(dto);
  }

  @Post('login')
  login(@Body() dto: AccountLoginDto) {
    return this.accounts.login(dto);
  }

  @Get('me')
  @UseGuards(CustomerJwtGuard)
  me(@Req() req: CustomerRequest) {
    return this.accounts.getProfile(req.customer!.id);
  }

  @Put('profile')
  @UseGuards(CustomerJwtGuard)
  updateProfile(@Req() req: CustomerRequest, @Body() dto: UpdateProfileDto) {
    return this.accounts.updateProfile(req.customer!.id, dto);
  }

  @Get('orders')
  @UseGuards(CustomerJwtGuard)
  orders(@Req() req: CustomerRequest) {
    return this.accounts.getOrders(req.customer!.email);
  }
}
