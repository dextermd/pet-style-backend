import { EntityBase, EntityBaseWithDate } from 'src/common/abstracts/entities';
import { hash } from 'bcrypt';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RefreshToken } from '../../refresh_token/entities/refresh_token.entity';
import { Pet } from 'src/modules/pets/entities/pet.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity({ name: 'users' })
export class User extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  notification_token: string;

  @JoinTable({
    name: 'user_has_roles',
    joinColumn: {
      name: 'id_user',
    },
    inverseJoinColumn: {
      name: 'id_role',
    },
  })
  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Pet, (pet) => pet.user)
  pets: Pet[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }
  }
}
