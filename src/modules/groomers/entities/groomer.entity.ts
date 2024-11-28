import { BaseEntity, Column, Entity, OneToMany } from 'typeorm';
import {
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { AppointmentException } from '../../appointment_exceptions/entities/appointment_exception.entity';
import { DayOfWeek } from '../../../common/enums/day_of_week.enum';

@Entity({ name: 'groomers' })
export class Groomer extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
    nullable: true,
    array: true,
  })
  salon_day_of_week: number[];

  @Column({
    type: 'enum',
    enum: DayOfWeek,
    nullable: true,
    array: true,
  })
  home_day_of_week: number[];

  @Column({ default: 0 })
  rating: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'double precision' })
  duration_time: number;

  @OneToMany(
    () => AppointmentException,
    (appointmentException) => appointmentException.groomer,
  )
  appointment_exceptions: AppointmentException[];

  @Column({ nullable: true })
  fcmToken: string;
}
