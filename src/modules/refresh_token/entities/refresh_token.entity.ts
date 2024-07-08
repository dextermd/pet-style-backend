import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import {
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'refresh_token' })
export class RefreshToken extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column()
  token: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;
}
