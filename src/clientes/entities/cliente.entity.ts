import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Boleto } from '../../boletos/entities/boleto.entity';

@Entity('cliente')
export class Cliente extends BaseEntity {
  @PrimaryGeneratedColumn()
  idCliente: number;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 50 })
  paterno: string;

  @Column({ length: 50, nullable: true })
  materno: string;

  @Column({ length: 100 })
  email: string;

  // 1 a N: un cliente tiene muchos boletos
  @OneToMany(() => Boleto, (boleto) => boleto.cliente)
  boletos: Boleto[];
}
