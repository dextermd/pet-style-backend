import { Module } from '@nestjs/common';
import { AppointmentExceptionsService } from './appointment_exceptions.service';
import { AppointmentExceptionsController } from './appointment_exceptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groomer } from '../groomers/entities/groomer.entity';
import { AppointmentException } from './entities/appointment_exception.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentException, Groomer, Appointment]),
  ],
  controllers: [AppointmentExceptionsController],
  providers: [AppointmentExceptionsService],
})
export class AppointmentExceptionsModule {}
