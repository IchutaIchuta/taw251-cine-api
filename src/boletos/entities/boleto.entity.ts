import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Funcion } from '../../funciones/entities/funcion.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

// N a M HECHA A MANO entre Funcion y Cliente.
// Es una entidad propia porque además de las 2 FK guarda datos de la venta.
@Entity('boleto')
export class Boleto extends BaseEntity {
  @PrimaryGeneratedColumn()
  idBoleto: number;

  @Column('int')
  idFuncion: number;

  @Column('int')
  idCliente: number;

  @Column('int')
  numeroAsiento: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  precioPagado: number;

  @ManyToOne(() => Funcion, (funcion) => funcion.boletos)
  @JoinColumn({ name: 'idFuncion' })
  funcion: Funcion;

  @ManyToOne(() => Cliente, (cliente) => cliente.boletos)
  @JoinColumn({ name: 'idCliente' })
  cliente: Cliente;
}
