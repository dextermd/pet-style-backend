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
  descriptionRu: string;

  @Column()
  descriptionRo: string;

  @Column()
  price: number;

  @Column()
  duration: number;

  @Column({ default: false })
  isActive: boolean;
}
