import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';
import { handleDBExceptions } from '../common/helpers/db-exception.handler';

@Injectable()
export class DoctorsService {
  private readonly logger = new Logger(DoctorsService.name);
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {
  }
  async create(createDoctorDto: CreateDoctorDto) {
    try {
      const exists = await this.doctorRepository.findOne({
        where: [
          { email: createDoctorDto.email },
          { phone_number: createDoctorDto.phone_number }
        ]
      });

      if (exists) {
        throw new BadRequestException(
          `El email o número de teléfono ya está registrado.`
        );
      }

      const doctor = this.doctorRepository.create(createDoctorDto);
      await this.doctorRepository.save(doctor);
      const {updatedAt, createdAt, deletedAt, isActive, ...rest} = doctor
      //TODO Retornar solo variables.
      return { message: "Doctor creado exitosamente", data: rest };

    } catch (error) {
      if (error instanceof HttpException) throw error;

      handleDBExceptions(error, this.logger);
    }
  }
  async findOne(id: number) {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id, isActive: true } });

      if (!doctor) throw new NotFoundException(`Doctor with id ${id} not found`);

      return { ok: true, doctor };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleDBExceptions(error, this.logger);
    }
  }
}
