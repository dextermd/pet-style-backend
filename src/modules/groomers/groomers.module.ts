import { Module } from '@nestjs/common';
import { GroomersService } from './groomers.service';
import { GroomersController } from './groomers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Groomer } from './entities/groomer.entity';
import { AppointmentException } from '../appointment_exceptions/entities/appointment_exception.entity';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Groomer, AppointmentException, Appointment]),
  ],
  controllers: [GroomersController],
  providers: [GroomersService],
})
export class GroomersModule {}
