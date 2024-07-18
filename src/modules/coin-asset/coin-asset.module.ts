import { Module } from '@nestjs/common';
import { CoinAssetService } from './coin-asset.service';
import { CoinAssetController } from './coin-asset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinAsset } from '@src/entities/coin-asset.entity';
import { ChainAddress } from '@src/entities/chain-address.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([CoinAsset, ChainAddress]), HttpModule],
  controllers: [CoinAssetController],
  providers: [CoinAssetService],
  exports: [CoinAssetService],
})
export class CoinAssetModule {}
