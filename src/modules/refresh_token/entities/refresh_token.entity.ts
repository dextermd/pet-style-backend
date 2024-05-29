import { Column, Entity, ManyToOne } from 'typeorm';
import {
  EmptyEntity,
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'refresh_token' })
export class RefreshToken extends EntityBaseWithDate(EntityBase(EmptyEntity)) {
  @Column()
  token: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
