import {
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'faq' })
export class Faq extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column()
  questionRu: string;

  @Column()
  questionRo: string;

  @Column()
  answerRu: string;

  @Column()
  answerRo: string;
}
