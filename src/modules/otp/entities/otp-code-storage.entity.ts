import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityBaseWithDate } from '../../../common/abstracts/entities';

@Entity('otp_code_storage')
export class OtpCodeStorage extends EntityBaseWithDate(BaseEntity) {
  @PrimaryColumn({ length: 20 })
  phone: string;

  @Column({ length: 20, nullable: false })
  code: string;

  @Column({ nullable: false })
  expiration_time: number;
}
