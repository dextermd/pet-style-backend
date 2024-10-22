import {
  EntityBase,
  EntityBaseWithDate,
} from '../../../common/abstracts/entities';
import { BaseEntity, Column, Entity } from 'typeorm';

// id: '4243b498-f715-4693-8556-54c8ba0f3bf7',
//   message: 'Сообщение отправлено',
//   receiver: '68751173',
//   segments: 1,
//   statusId: 1,
//   statusName: 'Ждет отправки',
//   dateCreate: '2024-10-21 14:13:10'
// }

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
