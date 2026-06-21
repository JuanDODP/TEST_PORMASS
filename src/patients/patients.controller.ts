import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) {}

    @Post()
    @ApiOperation({ summary: 'Registrar un nuevo paciente en el sistema' })
    @ApiResponse({ status: 201, description: 'Paciente creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'El email o número de teléfono ya está registrado.' })
    create(@Body() createPatientDto: CreatePatientDto) {
        return this.patientsService.create(createPatientDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar un paciente por su ID' })
    @ApiParam({ name: 'id', description: 'ID del paciente a buscar', example: 1 })
    @ApiResponse({ status: 200, description: 'Paciente encontrado exitosamente.' })
    @ApiResponse({ status: 404, description: 'No se encontró ningún paciente con ese ID.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.patientsService.findOne(id);
    }
}