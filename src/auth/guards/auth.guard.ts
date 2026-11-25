import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// Valida el header "Authorization: Bearer <token>".
// Se usa con @UseGuards(AuthGuard) en los endpoints protegidos.
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { usuario?: { sub: number; email: string } }>();
    const [tipo, token] = request.headers.authorization?.split(' ') ?? [];
    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token no enviado');
    }
    try {
      // Verifica la firma (JWT_SECRET) y la expiración; guarda el payload en la request
      request.usuario = await this.jwtService.verifyAsync<{
        sub: number;
        email: string;
      }>(token);
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return true;
  }
}
