import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentExceptionDto } from './create-appointment_exception.dto';

export class UpdateAppointmentExceptionDto extends PartialType(CreateAppointmentExceptionDto) {}
