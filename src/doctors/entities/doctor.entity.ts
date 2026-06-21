import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from '../../common/entities/base.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('doctors')
export class Doctor extends BaseEntity{
    @Column({type: 'varchar', length: 50})
    name: string;

    @Column({type: 'varchar', length: 15, unique: true})
    phone_number: string;

    @Column({type: 'varchar', length: 100, unique: true})
    email: string;
    @OneToMany(() => Appointment, (appointment) => appointment.doctor)
    appointments: Appointment[];
}
