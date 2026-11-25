import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Funcion } from '../../funciones/entities/funcion.entity';

@Entity('sala')
export class Sala extends BaseEntity {
  @PrimaryGeneratedColumn()
  idSala: number;

  @Column({ length: 100 })
  nombre: string;

  @Column('int')
  capacidad: number;

  @Column({ length: 10 }) // 2D, 3D, IMAX
  tipo: string;

  // 1 a N: una sala tiene muchas funciones
  @OneToMany(() => Funcion, (funcion) => funcion.sala)
  funciones: Funcion[];
}
