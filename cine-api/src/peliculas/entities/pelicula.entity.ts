import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Genero } from '../../generos/entities/genero.entity';
import { Funcion } from '../../funciones/entities/funcion.entity';

@Entity('pelicula')
export class Pelicula extends BaseEntity {
  @PrimaryGeneratedColumn()
  idPelicula: number;

  @Column({ length: 150 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  sinopsis: string;

  @Column('int')
  duracionMin: number;

  @Column({ length: 5 }) // ATP, +13, +18
  clasificacion: string;

  // 1 a N: una película tiene muchas funciones
  @OneToMany(() => Funcion, (funcion) => funcion.pelicula)
  funciones: Funcion[];

  // N a M AUTOMÁTICA: TypeORM crea la tabla pelicula_genero.
  // @JoinTable va solo en UN lado (el dueño de la relación).
  @ManyToMany(() => Genero, (genero) => genero.peliculas)
  @JoinTable({
    name: 'pelicula_genero',
    joinColumn: { name: 'idPelicula', referencedColumnName: 'idPelicula' },
    inverseJoinColumn: { name: 'idGenero', referencedColumnName: 'idGenero' },
  })
  generos: Genero[];
}
