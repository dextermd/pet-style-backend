import { Injectable } from '@nestjs/common';
import { CreateAppointmentExceptionDto } from './dto/create-appointment_exception.dto';
import { UpdateAppointmentExceptionDto } from './dto/update-appointment_exception.dto';

@Injectable()
export class AppointmentExceptionsService {
  create(createAppointmentExceptionDto: CreateAppointmentExceptionDto) {
    return 'This action adds a new appointmentException';
  }

  findAll() {
    return `This action returns all appointmentExceptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointmentException`;
  }

  update(id: number, updateAppointmentExceptionDto: UpdateAppointmentExceptionDto) {
    return `This action updates a #${id} appointmentException`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointmentException`;
  }
}
