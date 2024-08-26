import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentExceptionsService } from './appointment_exceptions.service';
import { CreateAppointmentExceptionDto } from './dto/create-appointment_exception.dto';
import { UpdateAppointmentExceptionDto } from './dto/update-appointment_exception.dto';

@Controller('appointment-exceptions')
export class AppointmentExceptionsController {
  constructor(private readonly appointmentExceptionsService: AppointmentExceptionsService) {}

  @Post()
  create(@Body() createAppointmentExceptionDto: CreateAppointmentExceptionDto) {
    return this.appointmentExceptionsService.create(createAppointmentExceptionDto);
  }

  @Get()
  findAll() {
    return this.appointmentExceptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentExceptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentExceptionDto: UpdateAppointmentExceptionDto) {
    return this.appointmentExceptionsService.update(+id, updateAppointmentExceptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentExceptionsService.remove(+id);
  }
}
