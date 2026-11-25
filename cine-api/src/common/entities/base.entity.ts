import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

// Campos de auditoría que comparten TODAS las entidades.
// Cada entidad hereda de esta clase (extends BaseEntity).
export abstract class BaseEntity {
  @CreateDateColumn({ type: 'timestamp' })
  creadoEn: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  actualizadoEn: Date;

  // Borrado lógico: softDelete() llena este campo en vez de borrar la fila
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  eliminadoEn: Date | null;
}
