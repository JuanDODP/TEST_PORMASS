import { BaseEntity } from '../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';
@Entity('patients')
export class Patient extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 15, unique: true })
    phone_number: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;
    @OneToMany(() => Appointment, (appointment) => appointment.patient)
    appointments: Appointment[];
}