import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength, Matches } from "class-validator";

export class CreatePatientDto {
    @ApiProperty({
        example: 'María García',
        description: 'Nombre completo del paciente. Mínimo 2 caracteres, máximo 50.',
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @ApiProperty({
        example: '5587654321',
        description: 'Número de teléfono del paciente. Solo dígitos, entre 10 y 15 caracteres.',
    })
    @IsString()
    @MinLength(10)
    @MaxLength(15)
    @Matches(/^[0-9]+$/, { message: 'El número de teléfono solo puede contener dígitos' })
    phone_number: string;

    @ApiProperty({
        example: 'paciente@example.com',
        description: 'Correo electrónico válido del paciente. Debe ser único en el sistema.',
    })
    @IsString()
    @IsEmail()
    email: string;
}