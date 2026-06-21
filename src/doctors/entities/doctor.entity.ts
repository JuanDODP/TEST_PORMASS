import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from '../../common/entities/base.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('doctors')
export class Doctor extends BaseEntity {

    @ApiProperty({
        example: 'Dr. Juan Pérez',
        description: 'Nombre completo del doctor.',
    })
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ApiProperty({
        example: '5512345678',
        description: 'Número de teléfono del doctor. Debe ser único en el sistema y solo puede contener dígitos.',
    })
    @Column({ type: 'varchar', length: 15, unique: true })
    phone_number: string;

    @ApiProperty({
        example: 'doctor@example.com',
        description: 'Correo electrónico del doctor. Debe ser único en el sistema.',
    })
    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @ApiProperty({
        description: 'Lista de citas que tiene asignadas este doctor.',
        type: () => [Appointment],
    })
    @OneToMany(() => Appointment, (appointment) => appointment.doctor)
    appointments: Appointment[];
}