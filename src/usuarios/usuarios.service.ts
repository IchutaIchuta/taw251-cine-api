import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Recibe la password YA encriptada (la encripta AuthService)
  async create(datos: {
    username: string;
    email: string;
    password: string;
  }): Promise<Omit<Usuario, 'password'>> {
    const usuario = this.usuarioRepository.create(datos);
    const guardado = await this.usuarioRepository.save(usuario);
    // save() devuelve el objeto con la password: la quitamos antes de responder
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...sinPassword } = guardado;
    return sinPassword;
  }

  // La password no viene (select: false)
  findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { email } });
  }

  // Solo para el login: pide la password explícitamente con addSelect
  findByEmailConPassword(email: string): Promise<Usuario | null> {
    return this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password')
      .where('usuario.email = :email', { email })
      .getOne();
  }
}
