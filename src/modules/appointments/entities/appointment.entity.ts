import {
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Groomer } from '../../groomers/entities/groomer.entity';

@Entity({ name: 'appointments' })
export class Appointment extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column()
  appointment_date: Date;

  @Column({ default: 'Home' })
  location: string;

  @Column({ default: 0 })
  status: number;

  @ManyToOne(() => User, (user) => user.appointments)
  user: User;

  @ManyToOne(() => Pet, (pet) => pet.id)
  pet: Pet;

  @ManyToOne(() => Groomer, (groomer) => groomer.id)
  groomer: Groomer;
}
