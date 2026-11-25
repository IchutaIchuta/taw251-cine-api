import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Omit<Usuario, 'password'>> {
    const existe = await this.usuariosService.findByEmail(dto.email);
    if (existe) {
      throw new BadRequestException(`El email ${dto.email} ya está registrado`);
    }
    // Encripta la password: nunca se guarda en texto plano
    const hash = await bcrypt.hash(dto.password, 10);
    return this.usuariosService.create({ ...dto, password: hash });
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const usuario = await this.usuariosService.findByEmailConPassword(
      dto.email,
    );
    // Mismo mensaje si el email no existe o si la password no coincide
    if (!usuario || !(await bcrypt.compare(dto.password, usuario.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    // Datos que viajan dentro del token (sub = id del usuario)
    const payload = { sub: usuario.idUsuario, email: usuario.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
