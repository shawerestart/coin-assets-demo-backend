import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoinAsset } from './coin-asset.entity';

@Entity('chain-address')
export class ChainAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    nullable: true,
  })
  chain_id: string;

  @Index()
  @Column({
    nullable: true,
  })
  network_id: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  address: string;

  @ManyToOne(() => CoinAsset, (coinAsset) => coinAsset.chain_addresses, {
    createForeignKeyConstraints: false,
  })
  coinAsset: CoinAsset;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
