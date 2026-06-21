import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, Min, MinLength } from "class-validator";
import { AppointmentStatus } from "../entities/appointment.entity";
import { Type } from "class-transformer";

export class CreateAppointmentDto {
    @IsDate()
    @Type(() => Date)
    date: Date;
    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    //TODO transformar strings a números en el controller o en el service, ¿Cuál es la mejor práctica? ¿Dónde debería manejarse la transformación de datos? 
    id_doctor: number;
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    id_patient: number;

}
