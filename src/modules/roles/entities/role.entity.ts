import { EntityBase, EntityBaseWithDate } from 'src/common/abstracts/entities';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity, Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: 'roles' })
export class Role extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column({ unique: true })
  name: string;

  @Column()
  image: string;

  @Column()
  route: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
