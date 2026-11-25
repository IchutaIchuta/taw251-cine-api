import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsuariosModule,
    JwtModule.registerAsync({
      global: true, // JwtService disponible en todos los módulos (lo usa el AuthGuard)
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>(
            'JWT_EXPIRES_IN',
            '1h',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
