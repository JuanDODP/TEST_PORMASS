// create-appointment.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { AppointmentStatus } from "../entities/appointment.entity";
import { Type } from "class-transformer";

export class CreateAppointmentDto {
    @ApiProperty({
        example: '2026-07-01T10:00:00',
        description: 'Fecha y hora de la cita. Debe ser una fecha futura. Cada cita tiene una duración fija de 30 minutos.',
    })
    @IsDate()
    @Type(() => Date)
    date: Date;

    @ApiPropertyOptional({
        example: 'scheduled',
        enum: AppointmentStatus,
        description: 'Estado de la cita. Por defecto es scheduled. No es necesario enviarlo al crear una cita.',
    })
    @ApiProperty({
        example: 1,
        description: 'ID del doctor que atenderá la cita. El doctor debe existir en el sistema.',
    })
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    id_doctor: number;

    @ApiProperty({
        example: 1,
        description: 'ID del paciente que asistirá a la cita. El paciente debe existir en el sistema.',
    })
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    id_patient: number;
}