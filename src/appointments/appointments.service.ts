import { BadRequestException, ConflictException, HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Not, Repository } from 'typeorm';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';
import { handleDBExceptions } from '../common/helpers/db-exception.handler';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly doctorsService: DoctorsService,
    private readonly patientsService: PatientsService,
  ) { }
  async create(createAppointmentDto: CreateAppointmentDto) {
    const { id_doctor, id_patient, date } = createAppointmentDto;
    const now = new Date();
    const mexicoTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
    const newEnd = new Date(date.getTime() + 30 * 60 * 1000);

    try {
      const { doctor } = await this.doctorsService.findOne(id_doctor);
      const { patient } = await this.patientsService.findOne(id_patient);

      const overlap = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.id_doctor = :doctorId', { doctorId: id_doctor })
        .andWhere('appointment.status = :status', { status: AppointmentStatus.SCHEDULED })
        .andWhere('appointment.date < :newEnd', { newEnd })
        .andWhere('DATE_ADD(appointment.date, INTERVAL 30 MINUTE) > :newStart', { newStart: date })
        .getOne();
      const overlapPatient = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .where('appointment.id_patient = :patientId', { patientId: id_patient })
        .andWhere('appointment.status = :status', { status: AppointmentStatus.SCHEDULED })
        .andWhere('appointment.date < :newEnd', { newEnd })
        .andWhere('DATE_ADD(appointment.date, INTERVAL 30 MINUTE) > :newStart', { newStart: date })
        .getOne();

      if (!doctor) throw new NotFoundException(`Doctor with id ${id_doctor} not found`);
      if (!patient) throw new NotFoundException(`Patient with id ${id_patient} not found`);

      if (date <= mexicoTime) throw new BadRequestException(`La fecha de la cita no puede ser en el pasado`);


      if (overlap) throw new ConflictException(`El doctor ${doctor?.name} ya tiene una cita en ese horario.`);
      if (overlapPatient) throw new ConflictException(`El paciente ${patient?.name} ya tiene una cita en ese horario.`);

      // 4. Crear la cita
      const appointment = this.appointmentRepository.create(createAppointmentDto);
      appointment.doctor = doctor;
      appointment.patient = patient;
      await this.appointmentRepository.save(appointment);
      const { updatedAt, createdAt, deletedAt, isActive, date: originalDate, doctor: d, patient: p, ...rest } = appointment
      const dateInMexico = new Date(originalDate).toLocaleString('es-MX', {
        timeZone: 'America/Mexico_City',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const { createdAt: dc, updatedAt: du, deletedAt: dd, isActive: di, ...doctorClean } = appointment.doctor;
      const { createdAt: pc, updatedAt: pu, deletedAt: pd, isActive: pi, ...patientClean } = appointment.patient;
      return {
        message: "Cita creada exitosamente", data: {
          ...rest,
          date: dateInMexico, doctor: doctorClean,
          patient: patientClean,
        }
      };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleDBExceptions(error, this.logger);
    }
  }

  async findAll(doctor_id?: number, start_date?: string, end_date?: string) {
    try {
      if (start_date && isNaN(Date.parse(start_date))) {
        throw new BadRequestException('start_date no es una fecha válida');
      }

      if (end_date && isNaN(Date.parse(end_date))) {
        throw new BadRequestException('end_date no es una fecha válida');
      }

      if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
        throw new BadRequestException('start_date no puede ser mayor que end_date');
      }

      if (doctor_id) {
        const { doctor } = await this.doctorsService.findOne(doctor_id);
        if (!doctor) throw new NotFoundException(`Doctor with id ${doctor_id} not found`);
      }

      const query = this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.doctor', 'doctor')
        .leftJoinAndSelect('appointment.patient', 'patient');

      if (doctor_id) {
        query.andWhere('appointment.id_doctor = :doctor_id', { doctor_id });
      }

      if (start_date) {
        const start = new Date(`${start_date}T00:00:00.000Z`);
        query.andWhere('appointment.date >= :start_date', { start_date: start });
      }

      if (end_date) {
        const end = new Date(`${end_date}T23:59:59.999Z`);
        query.andWhere('appointment.date <= :end_date', { end_date: end });
      }

      const appointments = await query.getMany();

      if (appointments.length === 0) {
        throw new NotFoundException('No se encontraron citas con los criterios especificados');
      }

      return { ok: true, total: appointments.length, appointments };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleDBExceptions(error, this.logger);
    }
  }

  async findOne(id: number) {
    try {
      const appointment = await this.appointmentRepository.findOne({ where: { id }, relations: { doctor: true, patient: true } });
      if (!appointment) throw new NotFoundException(`Appointment with id ${id} not found`);
      return { ok: true, appointment };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleDBExceptions(error, this.logger);
    }
  }
  async cancel(id: number) {
    try {
      const { appointment } = await this.findOne(id);

      if (!appointment) throw new NotFoundException(`Appointment with id ${id} not found`);

      if (appointment.status === AppointmentStatus.CANCELED) {
        throw new BadRequestException(`La cita ya está cancelada`);
      }

      // Verificar si la cita está en proceso
      const now = new Date();
      const appointmentEnd = new Date(appointment.date.getTime() + 30 * 60 * 1000);

      if (now >= appointment.date && now < appointmentEnd) {
        throw new BadRequestException(`No se puede cancelar una cita que está en proceso`);
      }

      // Verificar si la cita ya pasó
      if (now >= appointmentEnd) {
        throw new BadRequestException(`No se puede cancelar una cita que ya finalizó`);
      }

      appointment.status = AppointmentStatus.CANCELED;
      await this.appointmentRepository.save(appointment);

      return { ok: true, message: `La cita con el id ${id} ha sido cancelada` };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleDBExceptions(error, this.logger);
    }
  }
  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
