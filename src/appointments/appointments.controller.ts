import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  @ApiOperation({ summary: 'Agendar una nueva cita médica' })
  @ApiResponse({ status: 201, description: 'Cita agendada exitosamente.' })
  @ApiResponse({ status: 400, description: 'La fecha de la cita no puede ser en el pasado.' })
  @ApiResponse({ status: 404, description: 'El doctor o paciente no existe.' })
  @ApiResponse({ status: 409, description: 'El doctor o paciente ya tiene una cita en ese horario.' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Consultar todas las citas con filtros opcionales' })
  @ApiQuery({ name: 'doctor_id', required: false, description: 'Filtrar citas por ID del doctor', example: 1 })
  @ApiQuery({ name: 'start_date', required: false, description: 'Fecha de inicio del rango a consultar', example: '2026-07-01' })
  @ApiQuery({ name: 'end_date', required: false, description: 'Fecha de fin del rango a consultar', example: '2026-07-31' })
  @ApiResponse({ status: 200, description: 'Citas encontradas exitosamente.' })
  @ApiResponse({ status: 404, description: 'No se encontraron citas con los criterios especificados.' })
  findAll(
    @Query('doctor_id', new ParseIntPipe({ optional: true })) doctor_id?: number,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    return this.appointmentsService.findAll(doctor_id, start_date, end_date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una cita por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la cita a buscar', example: 1 })
  @ApiResponse({ status: 200, description: 'Cita encontrada exitosamente.' })
  @ApiResponse({ status: 404, description: 'No se encontró ninguna cita con ese ID.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar una cita previamente agendada' })
  @ApiParam({ name: 'id', description: 'ID de la cita a cancelar', example: 1 })
  @ApiResponse({ status: 200, description: 'Cita cancelada exitosamente.' })
  @ApiResponse({ status: 400, description: 'La cita ya está cancelada o está en proceso.' })
  @ApiResponse({ status: 404, description: 'No se encontró ninguna cita con ese ID.' })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.cancel(id);
  }
}