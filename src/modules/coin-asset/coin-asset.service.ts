import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { AxiosResponse } from 'axios';
import { CacheService } from '@src/share-modules/cache/cache.service';
import { QueryCoinAssetDto } from './dto/query-coin-asset.dto';
import { CoinAsset } from '@src/entities/coin-asset.entity';
import { ChainAddress } from '@src/entities/chain-address.entity';
import { apiUrl } from '@utils/string.util';
import { filterObject } from '@utils/object.util';
import { HttpService } from '@nestjs/axios';
import { Observable, firstValueFrom, lastValueFrom, map } from 'rxjs';

require('dotenv').config();

@Injectable()
export class CoinAssetService {
  constructor(
    @InjectRepository(CoinAsset)
    private coinAssetRepository: Repository<CoinAsset>,
    @InjectRepository(ChainAddress)
    private chainAddressRepository: Repository<ChainAddress>,
    private readonly cacheService: CacheService,
    private readonly httpService: HttpService,
  ) {}

  async getAssetsByFilter(queryLeagueDto: QueryCoinAssetDto) {
    const { filter_asset_id } = queryLeagueDto;
    const cacheAssets = await this.cacheService.getAssets(filter_asset_id);
    if (cacheAssets) {
      console.log('has cache');
      return this.cacheService.getAssets(filter_asset_id);
    }
    const res = await this.httpService.axiosRef.get<CoinAsset[]>('/v1/assets', {
      baseURL: process.env.API_URL,
      params: filterObject({ filter_asset_id }),
      headers: {
        'X-CoinAPI-Key': process.env.API_KEY,
      },
    });

    // Save to database and u can get a chart view by history data
    const coinAssets = this.coinAssetRepository.create(res.data);
    for (let i = 0; i < coinAssets.length; i++) {
      const item = coinAssets[i];
      if ((item.chain_addresses || []).length > 0) {
        const addresses = this.chainAddressRepository.create(
          item.chain_addresses,
        );
        const savedAddresses = await this.chainAddressRepository.save(
          addresses,
        );
        item.chain_addresses = savedAddresses;
        coinAssets[i] = item;
      }
    }
    const data = await this.coinAssetRepository.save(coinAssets);
    await this.cacheService.setAssets(
      filter_asset_id,
      {
        assets: data,
      },
      60 * 30,
    );
    return await this.cacheService.getAssets(filter_asset_id);
  }
}
