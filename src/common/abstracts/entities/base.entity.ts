import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type Constructor<T = object> = new (...args: any[]) => T;

export class EmptyEntity {}

export function EntityBase<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;
  }

  return AbstractBase;
}

export function EntityBaseWithDate<TBase extends Constructor>(Base: TBase) {
  abstract class AbstractBase extends Base {
    @CreateDateColumn({
      name: 'created_at',
      type: 'timestamp',
      nullable: true,
      default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @UpdateDateColumn({
      name: 'updated_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date;
  }

  return AbstractBase;
}
