import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    COMPLETED = 'completed',
    CANCELED = 'canceled',
}
@Entity('appointments')
export class Appointment extends BaseEntity {
    @Column()
    date: Date;
    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.SCHEDULED,
    })
    status: AppointmentStatus;
    @ManyToOne(() => Patient, (patient) => patient.appointments)
    @JoinColumn({ name: 'id_patient' })
    patient: Patient;
    @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
    @JoinColumn({ name: 'id_doctor' })
    doctor: Doctor;
}
