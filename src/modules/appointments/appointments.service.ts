import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Groomer } from '../groomers/entities/groomer.entity';
import { HwDayOfWeekAppointmentDto } from './dto/hw-day-of-week-appointment.dto';
import { TimeSlotAppointmentDto } from './dto/time-slot-appointment.dto';
import { Pet } from '../pets/entities/pet.entity';
import { User } from '../users/entities/user.entity';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Groomer)
    private groomerRepository: Repository<Groomer>,
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAvailableTimeSlots(date: string, groomerId: number) {
    const timeSlotsDto = new TimeSlotAppointmentDto();
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    const groomer = await this.groomerRepository.findOne({
      where: { id: groomerId },
      relations: ['appointment_exceptions'],
    });

    if (!groomer || groomerId == undefined) {
      throw new NotFoundException('Грумер не найден');
    }

    let startHour = 9;
    let endHour: number;
    const slots: string[] = [];
    const groomerDurationTime = groomer.duration_time;
    const homeEndHour = 18;

    if (groomer.home_day_of_week.includes(dayOfWeek)) {
      endHour = homeEndHour;
    } else {
      return [];
    }

    const exception = groomer.appointment_exceptions.find(
      (exc) => exc.start_date.toISOString().split('T')[0] === date,
    );

    if (exception) {
      if (exception.is_unavailable) return [];

      startHour = parseInt(exception.start_time.split(':')[0], 10);
      endHour = parseInt(exception.end_time.split(':')[0], 10);
    } else {
      const isHomeDay = groomer.home_day_of_week.includes(dayOfWeek);
      if (!isHomeDay) {
        throw new BadRequestException('Грумер не работает в этот день');
      }
    }

    for (let hour = startHour; hour < endHour; hour += groomerDurationTime) {
      const wholeHours = Math.floor(hour);
      const minutes = (hour % 1) * 60;
      const timeString = `${wholeHours}:${minutes === 0 ? '00' : '30'}`;
      slots.push(timeString);
    }

    const appointments = await this.appointmentRepository.find({
      where: {
        appointment_date: Between(
          new Date(`${date}T00:00:00`),
          new Date(`${date}T23:59:59`),
        ),
      },
    });

    const bookedSlots = appointments.map(
      (appointment) =>
        `${new Date(appointment.appointment_date).getHours()}:${new Date(appointment.appointment_date).getMinutes() === 0 ? '00' : '30'}`,
    );

    timeSlotsDto.allTimeSlot = slots;
    timeSlotsDto.availableTimeSlot = slots.filter((slot) => {
      return !bookedSlots.includes(slot);
    });

    return timeSlotsDto;
  }

  async getAvailableDaysOfWeekSlots(groomerId: number) {
    const groomer = await this.groomerRepository.findOne({
      where: { id: groomerId },
      relations: ['appointment_exceptions'],
    });

    if (!groomer || groomerId == undefined) {
      throw new NotFoundException('Грумер не найден');
    }

    const dayOfWeekSlotDto = new HwDayOfWeekAppointmentDto();
    dayOfWeekSlotDto.homeWorkDayOfWeek = [];
    dayOfWeekSlotDto.homeWorkDayOfWeek = groomer.home_day_of_week.map((day) => {
      return day;
    });

    return dayOfWeekSlotDto;
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    if (createAppointmentDto.user.id == undefined) {
      throw new BadRequestException('Пользователь не найден');
    }

    if (createAppointmentDto.pet.id == undefined) {
      throw new BadRequestException('Питомец не найден');
    }

    if (createAppointmentDto.groomer.id == undefined) {
      throw new BadRequestException('Грумер не найден');
    }

    const newAppointment = this.appointmentRepository.create({
      appointment_date: createAppointmentDto.appointment_date,
      location: createAppointmentDto.location,
      status: createAppointmentDto.status,
      user: { id: createAppointmentDto.user.id },
      pet: { id: createAppointmentDto.pet.id },
      groomer: { id: createAppointmentDto.groomer.id },
    });

    try {
      return await this.appointmentRepository.save(newAppointment);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Питомец уже записан на этот день');
      }
      throw error;
    }
  }

  findAll() {
    return `This action returns all appointments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }

  async isAppointmentExistByDateAndPetId(date: Date, petId: number) {
    return await this.appointmentRepository.findOne({
      where: {
        appointment_date: Between(startOfDay(date), endOfDay(date)),
        pet: { id: petId },
      },
    });
  }

  async getActiveAppointmentsByUser(userId: any) {
    return await this.appointmentRepository.find({
      where: {
        user: { id: userId },
        status: 0,
      },
      relations: ['user', 'pet', 'groomer'],
    });
  }
}
