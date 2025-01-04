import {
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'promotions' })
export class Promotion extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column()
  nameRu: string;

  @Column()
  nameRo: string;

  @Column()
  descriptionRu: string;

  @Column()
  descriptionRo: string;

  @Column()
  image: string;

  @Column()
  discount: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;
}
