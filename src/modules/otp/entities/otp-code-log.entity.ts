import {
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'otp_code_logs' })
export class OtpCodeLog extends EntityBaseWithDate(EntityBase(BaseEntity)) {
  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: false })
  code: string;

  @Column({ length: 200, nullable: false })
  io_code: string;

  @Column({ length: 20, nullable: false })
  operation: string;

  @Column({ length: 20, nullable: false })
  message_id: string;
}
