import {
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'messages' })
export class Message extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  receiver: User;

  // 0 => not delivered
  // 1 => delivered
  // 2 => read
  // 3 => failed
  @Column({ default: 0 })
  status: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;
}
