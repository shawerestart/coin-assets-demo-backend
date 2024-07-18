import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChainAddress } from './chain-address.entity';

@Entity('coin-assets')
export class CoinAsset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  asset_id: string;

  @Index()
  @Column()
  name: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  type_is_crypto: boolean;

  @Column()
  data_quote_start: string;

  @Column()
  data_quote_end: string;

  @Column()
  data_orderbook_start: string;

  @Column()
  data_orderbook_end: string;

  @Column()
  data_trade_start: string;

  @Column()
  data_trade_end: string;

  @Column({
    type: 'int',
  })
  data_symbols_count: number;

  @Column({
    type: 'decimal',
    precision: 30,
    scale: 2,
  })
  volume_1hrs_usd: number;

  @Column({
    type: 'decimal',
    precision: 30,
    scale: 2,
  })
  volume_1day_usd: number;

  @Column({
    type: 'decimal',
    precision: 30,
    scale: 2,
  })
  volume_1mth_usd: number;

  @Column({
    type: 'decimal',
    precision: 30,
    scale: 10,
  })
  price_usd: number;

  @Column()
  id_icon: string;

  @OneToMany(() => ChainAddress, (chainAddress) => chainAddress.coinAsset)
  chain_addresses: ChainAddress[];

  @Column()
  data_start: string;

  @Column()
  data_end: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
