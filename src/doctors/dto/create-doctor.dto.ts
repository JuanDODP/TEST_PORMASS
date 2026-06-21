import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateDoctorDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsString()
    @MinLength(10)
    @MaxLength(15)
    @Matches(/^[0-9]+$/, { message: 'El número de teléfono solo puede contener dígitos' })
    phone_number: string;

    @IsString()
    @IsEmail()
    email: string;


}
