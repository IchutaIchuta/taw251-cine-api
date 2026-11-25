import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Sala } from '../../salas/entities/sala.entity';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';
import { Boleto } from '../../boletos/entities/boleto.entity';

@Entity('funcion')
export class Funcion extends BaseEntity {
  @PrimaryGeneratedColumn()
  idFuncion: number;

  // Columna FK explícita (así podemos leer/escribir el id directamente)
  @Column('int')
  idSala: number;

  @Column('int')
  idPelicula: number;

  @Column({ type: 'timestamp' })
  fechaHora: Date;

  // Postgres devuelve decimal como string; el transformer lo pasa a number
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  precio: number;

  // N a 1: muchas funciones pertenecen a una sala
  @ManyToOne(() => Sala, (sala) => sala.funciones)
  @JoinColumn({ name: 'idSala' })
  sala: Sala;

  // N a 1: muchas funciones proyectan una película
  @ManyToOne(() => Pelicula, (pelicula) => pelicula.funciones)
  @JoinColumn({ name: 'idPelicula' })
  pelicula: Pelicula;

  // 1 a N: una función tiene muchos boletos
  @OneToMany(() => Boleto, (boleto) => boleto.funcion)
  boletos: Boleto[];
}
