import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards
} from "@nestjs/common";
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('available-slots/:date/:groomerId')
  getAvailableTimeSlots(
    @Param('date') date: string,
    @Param('groomerId') groomerId: number,
  ) {
    return this.appointmentsService.getAvailableTimeSlots(date, groomerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('available-days-of-week/:groomerId')
  getAvailableDaysOfWeek(@Param('groomerId') groomerId: number) {
    return this.appointmentsService.getAvailableDaysOfWeekSlots(groomerId);
  }
}
