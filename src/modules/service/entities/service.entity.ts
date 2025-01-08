import {
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'services' })
export class Service extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column()
  nameRu: string;

  @Column()
  nameRo: string;

  @Column()
  price: string;

  @Column({ nullable: true })
  duration: number;

  @Column({ default: false })
  isActive: boolean;
}
