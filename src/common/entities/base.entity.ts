import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
//TODO QUESTION: ¿Es necesario el campo deletedAt si ya tenemos el campo isActive? ¿No sería suficiente con uno de los dos para manejar la lógica de eliminación suave (soft delete)?
  @Column('boolean', { default: true })
  isActive: boolean;
}
