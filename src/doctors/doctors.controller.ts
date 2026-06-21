import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@ApiTags('Doctors')
@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) {}

    @Post()
    @ApiOperation({ summary: 'Registrar un nuevo doctor en el sistema' })
    @ApiResponse({ status: 201, description: 'Doctor creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'El email o número de teléfono ya está registrado.' })
    create(@Body() createDoctorDto: CreateDoctorDto) {
        return this.doctorsService.create(createDoctorDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar un doctor por su ID' })
    @ApiParam({ name: 'id', description: 'ID del doctor a buscar', example: 1 })
    @ApiResponse({ status: 200, description: 'Doctor encontrado exitosamente.' })
    @ApiResponse({ status: 404, description: 'No se encontró ningún doctor con ese ID.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.doctorsService.findOne(id);
    }
}