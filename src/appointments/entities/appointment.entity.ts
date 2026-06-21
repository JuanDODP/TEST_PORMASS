import { ApiProperty } from '@nestjs/swagger';
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

    @ApiProperty({
        example: '2026-07-01T10:00:00',
        description: 'Fecha y hora en la que está agendada la cita. Debe ser una fecha futura y no puede traslaparse con otra cita activa del mismo doctor.',
    })
    @Column()
    date: Date;

    @ApiProperty({
        example: 'scheduled',
        enum: AppointmentStatus,
        description: 'Estado actual de la cita. Una cita nueva siempre inicia como scheduled. Puede cancelarse pero no puede modificarse si ya está en proceso o finalizada.',
        default: AppointmentStatus.SCHEDULED,
    })
    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.SCHEDULED,
    })
    status: AppointmentStatus;

    @ApiProperty({
        description: 'Paciente al que pertenece esta cita.',
        type: () => Patient,
    })
    @ManyToOne(() => Patient, (patient) => patient.appointments)
    @JoinColumn({ name: 'id_patient' })
    patient: Patient;

    @ApiProperty({
        description: 'Doctor que atenderá esta cita.',
        type: () => Doctor,
    })
    @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
    @JoinColumn({ name: 'id_doctor' })
    doctor: Doctor;
}