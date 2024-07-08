import { EntityBase, EntityBaseWithDate } from 'src/common/abstracts/entities';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'pets' })
export class Pet extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column()
  photo: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  breed: string;

  @Column()
  gender: string;

  @Column()
  weight: number;

  @Column()
  behavior: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  birthDate: Date;

  @ManyToOne(() => User, (user) => user.pets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
