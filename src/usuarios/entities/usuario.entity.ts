import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('usuario')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUsuario: number;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  // select: false -> TypeORM NO trae la password en los find() normales.
  // Solo se obtiene pidiéndola explícitamente (ver UsuariosService).
  @Column({ select: false })
  password: string;
}
