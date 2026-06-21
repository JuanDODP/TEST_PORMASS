import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePatientDto {
     @IsString()
        @MinLength(2)
        @MaxLength(50)
        name: string;
        @IsString()
        @MinLength(2)
        @MaxLength(50)
        phone_number: string;
        @IsString()
        @IsEmail()
        email: string;
}
