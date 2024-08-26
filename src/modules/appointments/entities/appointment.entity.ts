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

  @Column()
  location: string;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.appointments)
  user: User;

  @ManyToOne(() => Pet, (pet) => pet.id)
  pet: Pet;

  @ManyToOne(() => Groomer, (groomer) => groomer.id)
  groomer: Groomer;
}
