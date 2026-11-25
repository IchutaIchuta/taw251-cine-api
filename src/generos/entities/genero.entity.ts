import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';

@Entity('genero')
export class Genero extends BaseEntity {
  @PrimaryGeneratedColumn()
  idGenero: number;

  @Column({ length: 50 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // N a M (lado inverso): NO lleva @JoinTable, eso va en Pelicula
  @ManyToMany(() => Pelicula, (pelicula) => pelicula.generos)
  peliculas: Pelicula[];
}
