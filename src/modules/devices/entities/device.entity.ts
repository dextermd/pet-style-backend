import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityBaseWithDate } from '../../../common/abstracts/entities';
import { IsNotEmpty } from 'class-validator';

@Entity({ name: 'devices' })
export class Device extends EntityBaseWithDate(BaseEntity) {
  @Column()
  clientId: number;

  @PrimaryColumn()
  @IsNotEmpty()
  deviceId: string;

  @Column()
  deviceName: string;

  @Column()
  os: string;

  @Column()
  osVersion: string;

  @Column()
  appVersion: string;

  @Column()
  appBuild: string;

  @Column()
  appPackage: string;

  @Column()
  fcmToken: string;

  @Column()
  lastConnect: Date;
}
