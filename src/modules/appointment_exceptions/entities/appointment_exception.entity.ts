import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { Groomer } from '../../groomers/entities/groomer.entity';

@Entity({ name: 'appointment_exceptions' })
export class AppointmentException extends EntityBaseWithDate(
  EntityBase(BaseEntity),
) {
  @Column()
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;

  @Column({ type: 'time', nullable: true })
  start_time: string;

  @Column({ type: 'time', nullable: true })
  end_time: string;

  @Column({ default: false })
  is_unavailable: boolean;

  @ManyToOne(() => Groomer, (groomer) => groomer.appointment_exceptions)
  @JoinColumn({ name: 'groomerId' })
  groomer: Groomer;
}
