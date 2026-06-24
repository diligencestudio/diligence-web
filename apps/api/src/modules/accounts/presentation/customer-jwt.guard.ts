import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AppConfigService } from '../../../config/app-config.service';

export interface CustomerRequest extends Request {
  customer?: { id: string; email: string };
}

/**
 * Protege los endpoints de cuenta. Exige un Bearer JWT válido con rol "customer"
 * y adjunta { id, email } del cliente a la request.
 */
@Injectable()
export class CustomerJwtGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<CustomerRequest>();
    const header = req.headers.authorization ?? '';
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta el token de autenticación');
    }
    try {
      const payload = this.jwt.verify<{
        sub: string;
        email: string;
        role: string;
      }>(token, { secret: this.config.jwt.secret });
      if (payload.role !== 'customer') {
        throw new UnauthorizedException('Token no válido para cuentas');
      }
      req.customer = { id: payload.sub, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
