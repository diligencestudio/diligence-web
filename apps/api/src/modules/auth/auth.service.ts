import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { AppConfigService } from '../../config/app-config.service';
import { LoginDto } from './login.dto';

/**
 * Autenticación de admin contra credenciales de entorno (un solo usuario admin).
 * Devuelve un JWT firmado para proteger los endpoints de escritura del catálogo.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
  ) {}

  login(dto: LoginDto): { token: string; email: string } {
    const { email, password } = this.config.admin;
    const ok =
      dto.email.trim().toLowerCase() === email.toLowerCase() &&
      dto.password === password;

    if (!ok) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const token = this.jwt.sign(
      { sub: email, role: 'admin' },
      {
        secret: this.config.jwt.secret,
        expiresIn: this.config.jwt.expiresIn as JwtSignOptions['expiresIn'],
      },
    );
    return { token, email };
  }
}
