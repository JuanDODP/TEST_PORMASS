import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateDoctorDto {
    @ApiProperty({
        example: 'Dr. Juan Pérez',
        description: 'Nombre completo del doctor. Mínimo 2 caracteres, máximo 50.',
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @ApiProperty({
        example: '5512345678',
        description: 'Número de teléfono del doctor. Solo dígitos, entre 10 y 15 caracteres.',
    })
    @IsString()
    @MinLength(10)
    @MaxLength(15)
    @Matches(/^[0-9]+$/, { message: 'El número de teléfono solo puede contener dígitos' })
    phone_number: string;

    @ApiProperty({
        example: 'doctor@example.com',
        description: 'Correo electrónico válido del doctor. Debe ser único en el sistema.',
    })
    @IsString()
    @IsEmail()
    email: string;
}