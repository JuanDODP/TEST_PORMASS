import { BadRequestException, HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { handleDBExceptions } from '../common/helpers/db-exception.handler';

@Injectable()

export class PatientsService {
  private readonly logger = new Logger('PatientsService');
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {
  }
  async create(createPatientDto: CreatePatientDto) {
    try {
      const exists = await this.patientRepository.findOne({
        where: [
          { email: createPatientDto.email },
          { phone_number: createPatientDto.phone_number }
        ]
      });

      if (exists) {
        throw new BadRequestException(
          `El email o número de teléfono ya está registrado.`
        );
      }

      const patient = this.patientRepository.create(createPatientDto);
      await this.patientRepository.save(patient);
      const { updatedAt, createdAt, deletedAt, isActive, ...rest } = patient

      return { message: "Paciente creado exitosamente", data: rest };

    } catch (error) {
      if (error instanceof HttpException) throw error;

      handleDBExceptions(error, this.logger);
    }
  }
  async findOne(id: number) {
    try {
      const patient = await this.patientRepository.findOne({ where: { id, isActive: true } });

      if (!patient) throw new NotFoundException(`Patient with id ${id} not found`);
      const { updatedAt, createdAt, deletedAt, isActive, ...rest } = patient;
      return { ok: true, patient };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleDBExceptions(error, this.logger);
    }
  }
}
