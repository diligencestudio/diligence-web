import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import type { AccountDTO, AuthResponse, OrderDTO } from '@diligence/contracts';
import { AppConfigService } from '../../../config/app-config.service';
import { OrdersService } from '../../orders/application/orders.service';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from '../domain/customer.repository';
import { RegisterDto } from './dto/register.dto';
import { AccountLoginDto } from './dto/account-login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { toAccountDTO } from './account.mapper';

/**
 * Casos de uso de cuentas de cliente: registro, login, perfil e historial.
 * Depende solo del puerto CustomerRepository (DIP). Las contraseñas se guardan
 * hasheadas con bcrypt; el login devuelve un JWT con rol "customer".
 */
@Injectable()
export class AccountsService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customers: CustomerRepository,
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
    private readonly orders: OrdersService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.customers.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con ese correo');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const customer = await this.customers.create({
      email: dto.email,
      fullName: dto.fullName,
      phone: dto.phone ?? '',
      passwordHash,
    });
    return this.issue(customer.id, customer.email, toAccountDTO(customer));
  }

  async login(dto: AccountLoginDto): Promise<AuthResponse> {
    const customer = await this.customers.findByEmail(dto.email);
    if (!customer) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const ok = await bcrypt.compare(dto.password, customer.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return this.issue(customer.id, customer.email, toAccountDTO(customer));
  }

  async getProfile(id: string): Promise<AccountDTO> {
    const customer = await this.customers.findById(id);
    if (!customer) throw new NotFoundException('Cuenta no encontrada');
    return toAccountDTO(customer);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<AccountDTO> {
    const customer = await this.customers.updateProfile(id, dto);
    if (!customer) throw new NotFoundException('Cuenta no encontrada');
    return toAccountDTO(customer);
  }

  /** Historial: pedidos cuyo email de contacto coincide con el de la cuenta. */
  async getOrders(email: string): Promise<OrderDTO[]> {
    return this.orders.listByCustomerEmail(email);
  }

  private issue(id: string, email: string, account: AccountDTO): AuthResponse {
    const token = this.jwt.sign(
      { sub: id, email, role: 'customer' },
      {
        secret: this.config.jwt.secret,
        expiresIn: this.config.jwt.expiresIn as JwtSignOptions['expiresIn'],
      },
    );
    return { token, account };
  }
}
