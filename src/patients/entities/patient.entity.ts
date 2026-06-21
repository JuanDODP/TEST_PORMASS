import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('patients')
export class Patient extends BaseEntity {

    @ApiProperty({
        example: 'María García',
        description: 'Nombre completo del paciente.',
    })
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ApiProperty({
        example: '5587654321',
        description: 'Número de teléfono del paciente. Debe ser único en el sistema y solo puede contener dígitos.',
    })
    @Column({ type: 'varchar', length: 15, unique: true })
    phone_number: string;

    @ApiProperty({
        example: 'paciente@example.com',
        description: 'Correo electrónico del paciente. Debe ser único en el sistema.',
    })
    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @ApiProperty({
        description: 'Lista de citas que tiene agendadas este paciente.',
        type: () => [Appointment],
    })
    @OneToMany(() => Appointment, (appointment) => appointment.patient)
    appointments: Appointment[];
}